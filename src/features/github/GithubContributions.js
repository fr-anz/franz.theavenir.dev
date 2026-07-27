const skeleton = Array.from(
  { length: 53 * 7 },
  () => `<span class="github-skeleton-cell"></span>`,
).join("");

export function GithubContributions() {
  return /* HTML */ `
    <section class="github container">
      <h2>Github</h2>

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
