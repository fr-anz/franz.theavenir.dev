import { site } from "../../content/site.js";

export function Footer() {
  return /* HTML */ `
    <footer class="footer">
      <div class="footer-inner">
        <h2 class="footer-name">Franz Emmanuel Baes</h2>

        <div class="footer-links">
          <div class="footer-link-group">
            <h3>Socials</h3>
            <ul>
              ${site.socialLinks
                .map(
                  (item) => /* HTML */ `
                    <li>
                      <a href="${item.href}" target="_blank" rel="noreferrer"
                        >${item.label}</a
                      >
                    </li>
                  `,
                )
                .join("")}
            </ul>
          </div>

          <div class="footer-link-group">
            <h3>Quick links</h3>
            <ul>
              ${site.navigation
                .map(
                  (item) => /* HTML */ `
                    <li><a href="${item.href}">${item.text}</a></li>
                  `,
                )
                .join("")}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  `;
}
