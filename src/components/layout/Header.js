import { site } from "../../content/site.js";

export function Header() {
  const currentPath = window.location.pathname;

  const links = site.navigation
    .map((link) => /* HTML */ {
      return /* HTML */ `
        <li>
          <a
            href="${link.href}"
            ${link.href === currentPath ? 'aria-current="page"' : ""}
            >${link.text}</a
          >
        </li>
      `;
    })
    .join("");

  return /* HTML */ `
    <header class="nav-bar">
      <div class="nav-container">
        <a href="/" class="logo"> { Franz } </a>
        <nav aria-label="Main navigation">
          <ul class="nav-list">
            ${links}
          </ul>
        </nav>
      </div>
    </header>
  `;
}
