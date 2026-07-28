export function initHeaderNavigation(
  navigation = document.querySelector("[data-header-navigation]"),
) {
  if (!navigation) return;

  const links = [...navigation.querySelectorAll('a[href^="#"]')];
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const sections = links
    .map((link) => ({
      link,
      section: document.querySelector(link.hash),
    }))
    .filter(({ section }) => section);

  function setCurrentLink(currentLink) {
    links.forEach((link) => {
      if (link === currentLink) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.hash);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start",
      });

      if (window.location.hash !== link.hash) {
        window.history.pushState(null, "", link.hash);
      }

      setCurrentLink(link);
    });
  });

  /*
   * A narrow observation band near the upper third of the viewport represents
   * the reader's current focus. IntersectionObserver updates only at section
   * boundaries, avoiding a continuous scroll event on every frame.
   */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const focusedSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (first, second) =>
            Math.abs(first.boundingClientRect.top) -
            Math.abs(second.boundingClientRect.top),
        )[0];

      if (!focusedSection) return;

      const current = sections.find(
        ({ section }) => section === focusedSection.target,
      );
      if (current) setCurrentLink(current.link);
    },
    {
      rootMargin: "-28% 0px -66% 0px",
      threshold: 0,
    },
  );

  sections.forEach(({ section }) => sectionObserver.observe(section));
}
