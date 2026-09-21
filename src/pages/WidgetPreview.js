import { achievements } from "../content/achievements.js";
import { projects } from "../content/projects.js";
import {
  SmallWinsTickets,
  GithubPunchCard,
  initTicketStack,
  initPunchCard,
} from "../features/widgets/DeskWidgets.js";
import "../styles/widget-preview.css";

const levels = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
];

function sampleCalendar() {
  // A deterministic preview, never represented as the owner's real activity.
  return Array.from({ length: 26 * 7 }, (_, index) => ({
    date: new Date(Date.UTC(2026, 2, 22 + index)).toISOString().slice(0, 10),
    contributionCount: (index * 7 + Math.floor(index / 5)) % 11,
    contributionLevel: levels[(index * 7 + Math.floor(index / 5)) % 5],
  }));
}

export async function initWidgetPreview(root) {
  document.title = "Widget concepts · Franz Emmanuel Baes";
  root.innerHTML = `<main class="desk-preview container">
    <header class="desk-heading">
      <div><a class="desk-back" href="/">← Back to portfolio</a>
      <p class="desk-eyebrow">Franz Emmanuel Baes / Widget studies</p>
      <h1>Little things for the desk.</h1>
      <p>Five small ideas. Made of paper, ink, and a little interaction.</p></div>
      <span class="desk-edition">INTERACTIVE PREVIEW<br>01 — 05</span>
    </header>
    <div class="desk-grid">
      <section class="desk-concept" aria-labelledby="ticket-heading">
        <h2 id="ticket-heading">Small wins</h2>
        ${SmallWinsTickets()}
      </section>
      <section class="desk-concept" aria-labelledby="punch-heading">
        <h2 id="punch-heading">GitHub</h2>
        ${GithubPunchCard()}
      </section>
      <section class="desk-concept" aria-labelledby="note-heading">
        <h2 id="note-heading"><span>03</span> Currently making</h2>
        <div class="note-stage"><article class="desk-note">
          <span class="note-tape" aria-hidden="true"></span>
          <p class="desk-eyebrow">On the desk / Sample status</p><h3>${projects[0].title}</h3>
          <p>A little space for the U-Belt community.</p>
          <p class="note-signature">Always learning.<br>Always making.</p>
          <button type="button" class="note-fold" aria-expanded="false" aria-controls="note-peek">Peek ↗</button>
          <div id="note-peek" class="note-peek" hidden><p>${projects[0].description}.</p><a href="${projects[0].projectLink}">Explore the project ↗</a></div>
        </article></div>
        <p class="desk-caption">Open the folded corner for a little more of the story.</p>
      </section>
      <section class="desk-concept" aria-labelledby="stamp-heading">
        <h2 id="stamp-heading"><span>04</span> Tiny stamp collection</h2>
        <div class="desk-stamps">${achievements.map((item, index) => `<button type="button" class="desk-stamp" data-stamp="${index}" aria-pressed="${index === 0}"><span>${item.title.split(",")[0].split(" - ")[0]}</span><strong>${item.distinction}</strong><span>${item.year}</span></button>`).join("")}</div>
        <div class="stamp-slip" data-stamp-slip role="status"><strong>${achievements[0].title}</strong><span>${achievements[0].distinction} · ${achievements[0].year}</span></div>
        <p class="desk-caption">Select a stamp. Revisit a milestone.</p>
      </section>
      <section class="desk-concept desk-swan-concept" aria-labelledby="swan-heading">
        <h2 id="swan-heading"><span>05</span> Fold your own swan</h2>
        <div class="swan-workbench">
          <div><p class="desk-eyebrow">A note, a fold, a little reminder.</p><h3>Leave a little trace.</h3><p>Every paper swan starts with a square.<br>Make yours, then leave a note in the jar.</p></div>
          <button type="button" class="fold-paper" data-fold-paper aria-label="Make the first fold"><span class="paper-shape" aria-hidden="true"></span><img src="/images/swans/swan-blue.png" alt="" hidden></button>
          <div class="swan-instructions"><p data-fold-status role="status">01 / Start with a square</p><button class="desk-action" type="button" data-fold-next>Make a fold ↗</button><a class="desk-action swan-visit" href="/#guestbook" hidden>Visit the guestbook ↗</a><button class="swan-reset" type="button" data-fold-reset hidden>Start again</button></div>
        </div>
        <p class="desk-caption">Click the paper to fold. A small introduction to the guestbook.</p>
      </section>
    </div>
    <footer class="desk-footer">SAME PAPER. A FEW NEW POSSIBILITIES.<a href="/">Return to the portfolio ↗</a></footer>
  </main>`;

  initTicketStack(root);
  root.querySelector(".note-fold").addEventListener("click", (event) => {
    const expanded =
      event.currentTarget.getAttribute("aria-expanded") !== "true";
    event.currentTarget.setAttribute("aria-expanded", String(expanded));
    event.currentTarget.textContent = expanded ? "Close ↙" : "Peek ↗";
    root.querySelector("#note-peek").hidden = !expanded;
  });
  root.querySelectorAll("[data-stamp]").forEach((button) => {
    button.addEventListener("click", () => {
      root
        .querySelectorAll("[data-stamp]")
        .forEach((stamp) =>
          stamp.setAttribute("aria-pressed", String(stamp === button)),
        );
      const item = achievements[Number(button.dataset.stamp)];
      root.querySelector("[data-stamp-slip]").innerHTML =
        `<strong>${item.title}</strong><span>${item.distinction} · ${item.year}</span>`;
    });
  });
  let fold = 0;
  const paper = root.querySelector("[data-fold-paper]");
  const next = root.querySelector("[data-fold-next]");
  const reset = root.querySelector("[data-fold-reset]");
  function renderFold() {
    paper.dataset.fold = fold;
    paper.querySelector(".paper-shape").hidden = fold === 2;
    paper.querySelector("img").hidden = fold !== 2;
    paper.disabled = fold === 2;
    paper.setAttribute(
      "aria-label",
      [
        "Make the first fold",
        "Finish your paper swan",
        "Your finished paper swan",
      ][fold],
    );
    root.querySelector("[data-fold-status]").textContent = [
      "01 / Start with a square",
      "02 / One more fold",
      "03 / Your little trace",
    ][fold];
    next.textContent = fold === 1 ? "Finish the swan ↗" : "Make a fold ↗";
    next.hidden = fold === 2;
    root.querySelector(".swan-visit").hidden = fold !== 2;
    reset.hidden = fold === 0;
  }
  function advanceFold() {
    fold = Math.min(2, fold + 1);
    renderFold();
    if (fold === 2) root.querySelector(".swan-visit").focus();
  }
  paper.addEventListener("click", advanceFold);
  next.addEventListener("click", advanceFold);
  reset.addEventListener("click", () => {
    fold = 0;
    renderFold();
    next.focus();
  });

  await initPunchCard(root, sampleCalendar());
}
