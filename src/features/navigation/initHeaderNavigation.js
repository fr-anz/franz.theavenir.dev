export function initHeaderNavigation(
  navigation = document.querySelector("[data-header-navigation]"),
) {
  if (!navigation) return;

  const links = [...navigation.querySelectorAll('a[href^="#"]')];
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

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
}
