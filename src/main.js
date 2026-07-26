import "./styles/global.css";
import "./styles/tokens.css";
import "./styles/layout.css";
import "./styles/pages.css";
import "./styles/utilities.css";
import "./styles/components.css";
import { HomePage } from "./pages/HomePage";
import { PageShell } from "./components/layout/PageShell";
import { fetchGithubContribution } from "./api/github";

const app = document.querySelector("#app");

app.innerHTML = PageShell(HomePage());

const email = "franzemmanuelbaes@gmail.com";

const copyEmail = document.querySelector("#copy-email");

copyEmail?.addEventListener("click", async () => {
  try {
    if (!navigator.clipboard) {
      throw new Error("Clipboard not found");
    }

    await navigator.clipboard.writeText(email);

    copyEmail.textContent = "Email Copied";

    setTimeout(() => {
      copyEmail.textContent = "email me";
    }, 1600);
  } catch {
    copyEmail.textContent = "Error";
  }
});

// Carousel setup
const carousel = document.querySelector("[data-carousel]");

if (carousel) {
  const cards = [...carousel.querySelectorAll("[data-carousel-card]")];
  let activeIndex = 0;

  function renderCarousel() {
    cards.forEach((card, index) => {
      const position = (index - activeIndex + cards.length) % cards.length;

      card.classList.toggle("is-active", position === 0);
      card.classList.toggle("is-next", position === 1);
      card.classList.toggle("is-prev", position === cards.length - 1);
    });
  }

  cards.forEach((card, index) => {
    card.addEventListener("click", (event) => {
      if (index === activeIndex) return;

      event.preventDefault();
      activeIndex = index;
      renderCarousel();
    });
  });

  renderCarousel();
}

// Github contribution calendar
const contributionContainer = document.querySelector("#github-contributions");

const contributionColors = {
  NONE: "#eeeeee",
  FIRST_QUARTILE: "#bfdbfe",
  SECOND_QUARTILE: "#93c5fd",
  THIRD_QUARTILE: "#2563eb",
  FOURTH_QUARTILE: "#1e3a8a",
};

fetchGithubContribution()
  .then((calendar) => {
    contributionContainer.innerHTML = `
       <div class="github-calendar">
         ${calendar.weeks
           .map(
             (week) => `
               <div class="github-week">
                 ${week.contributionDays
                   .map(
                     (day) => `
                     <span
                        class="github-day"
                        title="${day.date}: ${day.contributionCount} contributions"
                        style="background-color: ${
                          contributionColors[day.contributionLevel] || "#eeeeee"
                        }"
                      ></span>

                     `,
                   )
                   .join("")}
               </div>

             `,
           )
           .join("")}
       </div>
       <p class="contribution-count">${calendar.totalContributions} contributions in the last year</p>
     `;
  })
  .catch(() => {
    contributionContainer.textContent = "Unable to load GitHub contributions.";
  });
