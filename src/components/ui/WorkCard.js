export function WorkCard({
  title,
  description,
  image,
  imageAlt,
  projectLink,
  sourceLink,
} = {}) {
  return /* HTML */ `
    <article class="work-card">
      <img class="card-img" src="${image}" alt="${imageAlt}" />
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
