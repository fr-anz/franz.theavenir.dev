export function AchievementCard({ distinction, title, year, index } = {}) {
  return /* HTML */ `
    <article
      class="achievement-slide"
      data-achievement-slide
      id="achievement-slide-${index}"
      aria-hidden="true"
    >
      <div class="achievement-topline">
        <strong class="achievement-distinction">${distinction}</strong>
        <time class="achievement-year" datetime="${year}">${year}</time>
      </div>
      <h3 class="achievement-title">${title}</h3>
    </article>
  `;
}
