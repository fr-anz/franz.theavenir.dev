import { fetchGithubContributions } from "./githubClient.js";

const contributionColors = {
  NONE: "var(--color-bg)",
  FIRST_QUARTILE: "#d2d0e8",
  SECOND_QUARTILE: "#a29ed0",
  THIRD_QUARTILE: "#6b65b3",
  FOURTH_QUARTILE: "var(--color-accent)",
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
                          contributionColors[day.contributionLevel] ||
                          contributionColors.NONE
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
        <strong>${calendar.totalContributions.toLocaleString()}</strong>
        contributions in the last year
      </p>
    `;
  } catch {
    container.textContent = "Unable to load GitHub contributions.";
  } finally {
    container.removeAttribute("aria-busy");
  }
}
