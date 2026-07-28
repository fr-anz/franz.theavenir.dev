CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Guest notes publish immediately; there is deliberately no approval column.
CREATE TABLE IF NOT EXISTS guestbook_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author VARCHAR(40) NOT NULL,
  message VARCHAR(250) NOT NULL,
  swan_color VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Recreate the allowlist so rerunning this file also updates existing tables.
ALTER TABLE guestbook_notes
  DROP CONSTRAINT IF EXISTS guestbook_notes_swan_color_check;

ALTER TABLE guestbook_notes
  ADD CONSTRAINT guestbook_notes_swan_color_check CHECK (
    swan_color IN (
      '/images/swans/swan.png',
      '/images/swans/swan-black.png',
      '/images/swans/swan-blue.png',
      '/images/swans/swan-green.png',
      '/images/swans/swan-pink.png',
      '/images/swans/swan-purple.png',
      '/images/swans/swan-red.png',
      '/images/swans/swan-yellow.png'
    )
  );

CREATE INDEX IF NOT EXISTS guestbook_notes_created_at_idx
  ON guestbook_notes (created_at);

-- This stores a hashed client key, never the visitor's raw IP address.
CREATE TABLE IF NOT EXISTS guestbook_rate_limits (
  client_key VARCHAR(64) PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  request_count INTEGER NOT NULL DEFAULT 0
);
