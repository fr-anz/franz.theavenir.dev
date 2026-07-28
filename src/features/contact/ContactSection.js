import { site } from "../../content/site.js";
import { Icon } from "../../components/ui/Icon.js";

export function ContactSection() {
  return /* HTML */ `
    <section
      class="contact container"
      id="contact"
      aria-labelledby="contact-title"
    >
      <h2 id="contact-title">Contact Me</h2>

      <div class="contact-grid">
        <div class="contact-column">
          <h3>Socials</h3>
          <ul>
            ${site.socialLinks
              .map(
                (item) => /* HTML */ `
                  <li>
                    <a
                      class="contact-link"
                      href="${item.href}"
                      target="_blank"
                      rel="noreferrer"
                    >
                      ${Icon(item.icon)}
                      <span>${item.label}</span>
                    </a>
                  </li>
                `,
              )
              .join("")}
          </ul>
        </div>

        <div class="contact-column">
          <h3>Personal contact</h3>
          <a class="contact-link" href="mailto:${site.email}">
            ${Icon("mail")}
            <span>${site.email}</span>
          </a>
        </div>
      </div>
    </section>
  `;
}
