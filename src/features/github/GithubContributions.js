const skeleton = Array.from(
  { length: 53 * 7 },
  () => `<span class="github-skeleton-cell"></span>`,
).join("");

export function GithubContributions() {
  return /* HTML */ `
    <section class="github hero-widget">
      <h2>In the making — GitHub</h2>

      <div
        id="github-contributions"
        aria-busy="true"
        aria-label="Loading GitHub contributions"
      >
        <div class="github-skeleton" aria-hidden="true">${skeleton}</div>
      </div>
    </section>
  `;
}
