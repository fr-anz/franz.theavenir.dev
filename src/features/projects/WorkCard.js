import { Icon } from "../../components/ui/Icon.js";

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
    <article class="work-card">
      <img
        class="card-img"
        src="${image}"
        alt="${accessibleImageAlt}"
        loading="lazy"
      />
      <div class="card-body">
        <h3>${title}</h3>
        <p>${description}</p>

        <div class="card-buttons">
          <a class="button" href="${projectLink}">
            View project ${Icon("arrowUpRight")}
          </a>
          <a class="button" href="${sourceLink}">
            Source ${Icon("arrowUpRight")}
          </a>
        </div>
      </div>
    </article>
  `;
}
