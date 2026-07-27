import { site } from "../../content/site.js";

export function Footer() {
  return /* HTML */ `
    <footer class="footer">
      <ul>
        ${site.socialLinks
          .map(
            (item) => /* HTML */ `
              <li><a href="${item.href}">${item.label}</a></li>
            `,
          )
          .join("")}
      </ul>
    </footer>
  `;
}
