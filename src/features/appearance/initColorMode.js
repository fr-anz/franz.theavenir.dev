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
  }

  render();

  button.addEventListener("click", () => {
    enabled = !enabled;
    render();

    try {
      localStorage.setItem(storageKey, enabled ? "color" : "muted");
    } catch {
      // Keep the selected mode active for this visit.
    }
  });
}
