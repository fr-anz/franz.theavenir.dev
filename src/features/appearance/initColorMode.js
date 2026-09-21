export function initColorMode(
  button = document.querySelector("[data-color-mode-toggle]"),
) {
  if (!button) return;

  const storageKey = "portfolio-color-mode";
  let enabled = false;

  try {
    enabled = localStorage.getItem(storageKey) === "color";
  } catch {
    // The toggle still works when browser storage is unavailable.
  }

  function render() {
    document.documentElement.classList.toggle("color-mode", enabled);
    button.setAttribute("aria-pressed", String(enabled));
    button.setAttribute(
      "aria-label",
      enabled ? "Show monochrome" : "Show colors",
    );
  }

  render();

  function changeTheme() {
    enabled = !enabled;
    render();
    try {
      localStorage.setItem(storageKey, enabled ? "color" : "muted");
    } catch {
      // Keep the selected mode active for this visit.
    }
  }

  let transitioning = false;
  button.addEventListener("click", async () => {
    if (transitioning) return;
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      changeTheme();
      return;
    }

    transitioning = true;
    const root = document.documentElement;
    const bounds = button
      .querySelector(".color-mode-swatch")
      .getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    const feather = Math.min(180, Math.max(90, innerWidth * 0.14));
    root.style.setProperty("--theme-origin-x", `${x}px`);
    root.style.setProperty("--theme-origin-y", `${y}px`);
    root.style.setProperty("--theme-feather", `${feather}px`);
    root.classList.add("theme-transitioning");
    const transition = document.startViewTransition(changeTheme);
    try {
      await transition.ready;
      const reveal = root.animate(
        {
          "--theme-reveal-radius": ["0px", `${radius + feather}px`],
        },
        {
          duration: 1450,
          easing: "cubic-bezier(0.45, 0, 0.25, 1)",
          pseudoElement: "::view-transition-new(root)",
          fill: "forwards",
        },
      );
      // Dim the outgoing paper slightly so the reveal reads on neutral areas too.
      const outgoing = root.animate(
        [
          { filter: "brightness(1)" },
          { filter: "brightness(0.88)", offset: 0.25 },
          { filter: "brightness(0.88)" },
        ],
        {
          duration: 1450,
          easing: "ease-out",
          pseudoElement: "::view-transition-old(root)",
        },
      );
      await Promise.all([reveal.finished, outgoing.finished]);
    } catch {
      // A skipped snapshot still applies the requested theme.
    } finally {
      await transition.finished;
      root.classList.remove("theme-transitioning");
      transitioning = false;
    }
  });
}
