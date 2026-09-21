import { achievements } from "../../content/achievements.js";
import { fetchGithubContributions } from "../github/githubClient.js";
import "../../styles/desk-widgets.css";

const levels = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
];

function ticket(achievement, index) {
  return `<article class="desk-ticket" style="--position:${index}">
    <div class="ticket-body">
    <span class="ticket-stub">Small wins</span>
    <div class="ticket-content">
    <h3>${achievement.title}</h3><span class="ticket-stamp">${achievement.distinction}</span></div>
    </div>
    <button type="button" class="ticket-next" aria-label="Tear Small wins stub to show next ticket" ${index === 0 ? "" : "disabled"}></button>
  </article>`;
}

export function SmallWinsTickets() {
  return `<div class="ticket-stage" data-ticket-stage>${achievements.map(ticket).join("")}<button type="button" class="ticket-playback" data-ticket-playback aria-label="Pause automatic shuffle">Ⅱ</button></div>`;
}

export function GithubPunchCard() {
  return `<article class="desk-punch">
          <div class="punch-heading"><a href="https://github.com/fr-anz">@fr-anz ↗</a></div>
          <p class="punch-source" data-calendar-source role="status">Loading GitHub activity…</p>
          <div class="punch-calendar"><div class="punch-grid" data-punch-grid aria-label="Daily GitHub contributions" aria-busy="true"></div></div>
          <p class="punch-detail" data-punch-detail role="status">Select an ink mark to see the day's activity.</p>
        </article>`;
}

export function initTicketStack(root) {
  let front = 0;
  const stage = root.querySelector("[data-ticket-stage]");
  const playback = root.querySelector("[data-ticket-playback]");
  const cards = [...stage.querySelectorAll(".desk-ticket")];
  let tearing = false;
  function showNext() {
    front = (front + 1) % cards.length;
    cards.forEach((card, index) => {
      card.style.setProperty(
        "--position",
        (index - front + cards.length) % cards.length,
      );
      card.querySelector(".ticket-next").disabled = index !== front;
    });
  }
  cards.forEach((card) => {
    card.querySelector(".ticket-next").addEventListener("click", async () => {
      if (tearing) return;
      tearing = true;
      const button = card.querySelector(".ticket-next");
      const restoreFocus = document.activeElement === button;
      let tear;
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        tear = card.querySelector(".ticket-stub").animate(
          [
            { transform: "translate(0, 0) rotate(0)", opacity: 1 },
            {
              transform: "translate(-8px, 2px) rotate(-3deg)",
              opacity: 1,
              offset: 0.35,
            },
            { transform: "translate(-38px, 20px) rotate(-12deg)", opacity: 0 },
          ],
          { duration: 420, easing: "ease-in", fill: "forwards" },
        );
        await tear.finished;
      }
      showNext();
      tear?.cancel();
      if (
        (restoreFocus && document.activeElement === document.body) ||
        (restoreFocus && document.activeElement === button)
      ) {
        cards[front]
          .querySelector(".ticket-next")
          .focus({ preventScroll: true });
      }
      tearing = false;
    });
  });
  let paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function updatePlayback() {
    playback.textContent = paused ? "▷" : "Ⅱ";
    playback.setAttribute(
      "aria-label",
      paused ? "Start automatic shuffle" : "Pause automatic shuffle",
    );
  }
  updatePlayback();
  playback.addEventListener("click", () => {
    paused = !paused;
    updatePlayback();
  });
  const shuffleTimer = window.setInterval(() => {
    if (!stage.isConnected) {
      window.clearInterval(shuffleTimer);
      return;
    }
    if (
      tearing ||
      paused ||
      document.hidden ||
      stage.matches(":hover, :focus-within")
    )
      return;
    showNext();
  }, 4000);
}

export async function initPunchCard(root, fallbackDays) {
  let days;
  try {
    const calendar = await fetchGithubContributions();
    days = calendar.weeks.flatMap((week) => week.contributionDays);
    root.querySelector("[data-calendar-source]").textContent =
      `${calendar.totalContributions.toLocaleString()} contributions · Last 12 months`;
  } catch {
    if (!fallbackDays) {
      root.querySelector("[data-calendar-source]").textContent =
        "Unable to load GitHub activity.";
      root.querySelector("[data-punch-grid]").removeAttribute("aria-busy");
      root.querySelector("[data-punch-detail]").textContent = "";
      return;
    }
    days = fallbackDays;
    root.querySelector("[data-calendar-source]").textContent =
      "Sample activity · Live GitHub data unavailable in this preview";
  }
  const grid = root.querySelector("[data-punch-grid]");
  grid.style.setProperty("--weeks", Math.ceil(days.length / 7));
  days.forEach((day) => {
    const mark = document.createElement("button");
    mark.type = "button";
    mark.className = `punch-mark ink-${Math.max(0, levels.indexOf(day.contributionLevel))}`;
    const label = `${day.date}: ${day.contributionCount} contributions`;
    mark.setAttribute("aria-label", label);
    mark.title = label;
    mark.addEventListener("click", () => {
      root.querySelector("[data-punch-detail]").textContent = label;
    });
    grid.append(mark);
  });
  grid.removeAttribute("aria-busy");
}
