import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const MAX_AUTHOR_LENGTH = 40;
const MAX_MESSAGE_LENGTH = 250;
const RATE_LIMIT_WINDOW = "10 minutes";
const RATE_LIMIT_MAX_REQUESTS = 5;

// This is intentionally duplicated on the server: a client must not be able
// to submit an arbitrary image URL and turn it into stored page content.
const SWAN_COLORS = new Set([
  "/images/swans/swan.png",
  "/images/swans/swan-black.png",
  "/images/swans/swan-blue.png",
  "/images/swans/swan-green.png",
  "/images/swans/swan-pink.png",
  "/images/swans/swan-red.png",
  "/images/swans/swan-yellow.png",
]);

let sqlClient;

function getSqlClient() {
  if (!process.env.DATABASE_URL) return null;

  sqlClient ??= neon(process.env.DATABASE_URL);
  return sqlClient;
}

function sendJson(response, status, payload) {
  response.setHeader("Cache-Control", "no-store");
  return response.status(status).json(payload);
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "object") return body;

  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

function normalizedString(value) {
  if (typeof value !== "string") return "";

  return value.trim();
}

function getClientAddress(request) {
  const forwardedFor = request.headers["x-forwarded-for"];
  const forwardedAddress = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(",")[0];

  return forwardedAddress?.trim() || request.socket?.remoteAddress || "unknown";
}

function getClientKey(request) {
  // Store a one-way key instead of a raw IP. Set RATE_LIMIT_SALT in Vercel so
  // the same visitor cannot be recognized if this table is ever exposed.
  const salt = process.env.RATE_LIMIT_SALT || process.env.DATABASE_URL || "dev";

  return createHash("sha256")
    .update(`${salt}:${getClientAddress(request)}`)
    .digest("hex");
}

function findSpamReason(author, message, honeypot) {
  if (honeypot) return "honeypot";
  if (/\u0000/.test(`${author}${message}`)) return "control-character";

  const urlCount = (message.match(/https?:\/\/|www\./gi) || []).length;
  if (urlCount > 1) return "too-many-links";
  if (/(.)\1{9,}/u.test(message)) return "repeated-character";
  if (/\b([a-z0-9]{2,})(?:\s+\1){4,}\b/i.test(message)) {
    return "repeated-word";
  }

  return null;
}

async function checkRateLimit(sql, clientKey) {
  const [row] = await sql`
    INSERT INTO guestbook_rate_limits (client_key, window_started_at, request_count)
    VALUES (${clientKey}, now(), 1)
    ON CONFLICT (client_key) DO UPDATE SET
      request_count = CASE
        WHEN guestbook_rate_limits.window_started_at <= now() - ${RATE_LIMIT_WINDOW}::interval
          THEN 1
        ELSE guestbook_rate_limits.request_count + 1
      END,
      window_started_at = CASE
        WHEN guestbook_rate_limits.window_started_at <= now() - ${RATE_LIMIT_WINDOW}::interval
          THEN now()
        ELSE guestbook_rate_limits.window_started_at
      END
    RETURNING request_count
  `;

  return row.request_count <= RATE_LIMIT_MAX_REQUESTS;
}

export default async function handler(request, response) {
  const sql = getSqlClient();

  if (!sql) {
    return sendJson(response, 503, {
      error: "Guestbook database is not configured.",
    });
  }

  try {
    if (request.method === "GET") {
      const notes = await sql`
        SELECT
          id::text,
          author,
          message,
          swan_color AS "swanColor",
          created_at AS "createdAt"
        FROM guestbook_notes
        ORDER BY created_at ASC
      `;

      return sendJson(response, 200, notes);
    }

    if (request.method !== "POST") {
      response.setHeader("Allow", "GET, POST");
      return sendJson(response, 405, { error: "Method not allowed." });
    }

    const body = parseBody(request.body);
    const author = normalizedString(body.author);
    const message = normalizedString(body.message);
    const swanColor = normalizedString(body.swanColor);

    if (
      !author ||
      !message ||
      author.length > MAX_AUTHOR_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH ||
      !SWAN_COLORS.has(swanColor)
    ) {
      return sendJson(response, 400, { error: "Please check your note." });
    }

    if (findSpamReason(author, message, body.website)) {
      return sendJson(response, 400, {
        error: "This note could not be added.",
      });
    }

    const withinRateLimit = await checkRateLimit(sql, getClientKey(request));
    if (!withinRateLimit) {
      response.setHeader("Retry-After", "600");
      return sendJson(response, 429, {
        error: "Too many notes. Please try again later.",
      });
    }

    const [duplicate] = await sql`
      SELECT id
      FROM guestbook_notes
      WHERE lower(message) = lower(${message})
        AND created_at >= now() - interval '1 day'
      LIMIT 1
    `;

    if (duplicate) {
      return sendJson(response, 409, {
        error: "That note was already added recently.",
      });
    }

    const [note] = await sql`
      INSERT INTO guestbook_notes (author, message, swan_color)
      VALUES (${author}, ${message}, ${swanColor})
      RETURNING
        id::text,
        author,
        message,
        swan_color AS "swanColor",
        created_at AS "createdAt"
    `;

    return sendJson(response, 201, { note });
  } catch (error) {
    console.error("Guestbook API error", error);

    if (error?.code === "42P01") {
      return sendJson(response, 503, {
        error: "Run database/guestbook.sql in Neon before using the guestbook.",
      });
    }

    return sendJson(response, 500, {
      error: "The guestbook is temporarily unavailable.",
    });
  }
}
