const navLinks = [
  { href: "/", text: "Home" },
  { href: "/works", text: "Works" },
  { href: "/contact", text: "Contact" },
  { href: "/guestbook", text: "Guestbook" },
];

export function Header() {
  const currentPath = window.location.pathname;

  const links = navLinks
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
