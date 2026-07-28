export function initScrollReveal(
  sections = document.querySelectorAll("main > section:not(.hero)"),
) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    return;
  }

  const targets = [...sections];
  targets.forEach((section) => section.setAttribute("data-scroll-reveal", ""));
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
      threshold: 0.1,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  targets.forEach((section) => {
    // Content already inside the initial viewport should never flash hidden.
    if (section.getBoundingClientRect().top < window.innerHeight * 0.92) {
      section.classList.add("is-visible");
      return;
    }

    observer.observe(section);
  });
}
