const footerItems = [
  { href: "https://github.com/fr-anz", label: "Github" },
  { href: "https://www.linkedin.com/in/franzbs", label: "LinkedIn" },
  { href: "https://twitter.com/znrfrnz", label: "Twitter" },
];

export function Footer() {
  return /* HTML */ `
    <footer class="footer">
      <ul>
        ${footerItems
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
