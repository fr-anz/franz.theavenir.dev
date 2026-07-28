import { site } from "../../content/site.js";

export function Header() {
  const currentSection = window.location.hash || "#about";

  const links = site.navigation
    .map((link) => /* HTML */ {
      return /* HTML */ `
        <li>
          <a
            href="${link.href}"
            ${link.href === currentSection ? 'aria-current="location"' : ""}
            >${link.text}</a
          >
        </li>
      `;
    })
    .join("");

  return /* HTML */ `
    <header class="nav-bar">
      <div class="nav-container">
        <a href="#about" class="logo"> { Franz } </a>
        <nav aria-label="Main navigation" data-header-navigation>
          <ul class="nav-list">
            ${links}
          </ul>
        </nav>
      </div>
    </header>
  `;
}
