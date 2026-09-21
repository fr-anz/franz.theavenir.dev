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
        <a href="#about" class="logo" aria-label="Franz, back to top">f/b</a>
        <nav aria-label="Main navigation" data-header-navigation>
          <ul class="nav-list">
            ${links}
          </ul>
        </nav>
        <button
          class="color-mode-toggle"
          type="button"
          aria-label="Show colors"
          aria-pressed="false"
          data-color-mode-toggle
        >
          <span class="color-mode-callout" aria-hidden="true">
            <span>Click me</span>
            <svg viewBox="0 0 60 32" fill="none">
              <path d="M3 24C16 34 39 30 52 7M42 10L52 7L54 18" />
            </svg>
          </span>
          <span class="color-mode-swatch" aria-hidden="true"></span>
        </button>
      </div>
    </header>
  `;
}
