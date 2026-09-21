const skeleton = Array.from(
  { length: 53 * 7 },
  () => `<span class="github-skeleton-cell"></span>`,
).join("");

export function GithubContributions() {
  return /* HTML */ `
    <section class="github hero-widget" aria-labelledby="github-title">
      <h2 id="github-title">GitHub</h2>

      <div class="github-card">
        <div class="github-card-header">
          <a class="github-profile" href="https://github.com/fr-anz"
            >@fr-anz ↗</a
          >
          <span class="github-period">Last 12 months</span>
        </div>
        <div
          id="github-contributions"
          aria-busy="true"
          aria-label="GitHub contributions"
        >
          <div class="github-skeleton" aria-hidden="true">${skeleton}</div>
          <p class="contribution-count">Loading contributions…</p>
        </div>
      </div>
    </section>
  `;
}
