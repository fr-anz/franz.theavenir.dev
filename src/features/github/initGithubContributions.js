import { fetchGithubContributions } from "./githubClient.js";

const contributionColors = {
  NONE: "#eeeeee",
  FIRST_QUARTILE: "#bfdbfe",
  SECOND_QUARTILE: "#93c5fd",
  THIRD_QUARTILE: "#2563eb",
  FOURTH_QUARTILE: "#1e3a8a",
};

export async function initGithubContributions(
  container = document.querySelector("#github-contributions"),
) {
  if (!container) return;

  try {
    const calendar = await fetchGithubContributions();

    container.innerHTML = `
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
      <p class="contribution-count">
        ${calendar.totalContributions} contributions in the last year
      </p>
    `;
  } catch {
    container.textContent = "Unable to load GitHub contributions.";
  } finally {
    container.removeAttribute("aria-busy");
  }
}
