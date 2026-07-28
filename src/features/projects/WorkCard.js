export function WorkCard({
  title,
  description,
  image,
  imageAlt,
  projectLink,
  sourceLink,
} = {}) {
  const accessibleImageAlt = imageAlt || `${title} project screenshot`;

  return /* HTML */ `
    <article class="work-card carousel-card" data-carousel-card>
      <img class="card-img" src="${image}" alt="${accessibleImageAlt}" />
      <div class="card-body">
        <h3>${title}</h3>
        <p>${description}</p>

        <div class="card-buttons">
          <a class="button" href=${projectLink}>View Project</a>
          <a class="button" href=${sourceLink}>Source</a>
        </div>
      </div>
    </article>
  `;
}
