export function initScrollReveal(
  sections = document.querySelectorAll(
    ".hero-widget, .work-text, .work-card, .guestbook > h2, .guestbook > .section-note, .guestbook-display, .contact > h2, .contact-column, .footer",
  ),
) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    return;
  }

  const targets = [...sections];
  targets.forEach((section) => {
    section.setAttribute("data-scroll-reveal", "");
    const siblings = [...section.parentElement.children].filter((child) =>
      targets.includes(child),
    );
    section.style.setProperty(
      "--reveal-delay",
      `${Math.min(siblings.indexOf(section), 2) * 80}ms`,
    );
    section.addEventListener("focusin", () =>
      section.classList.add("is-visible"),
    );
  });
  document.documentElement.classList.add("has-scroll-reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -5% 0px",
    },
  );

  targets.forEach((section) => {
    // Content already inside the initial viewport should never flash hidden.
    const bounds = section.getBoundingClientRect();
    if (
      bounds.top < window.innerHeight * 0.95 &&
      bounds.left < window.innerWidth &&
      bounds.right > 0
    ) {
      section.classList.add("is-visible");
      return;
    }

    observer.observe(section);
  });
}
