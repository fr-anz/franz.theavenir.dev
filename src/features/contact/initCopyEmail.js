import { site } from "../../content/site.js";

export function initCopyEmail(button = document.querySelector("#copy-email")) {
  if (!button) return;

  button.addEventListener("click", async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard not found");
      }

      await navigator.clipboard.writeText(site.email);
      button.textContent = "Email Copied";

      setTimeout(() => {
        button.textContent = "Email me";
      }, 1600);
    } catch {
      button.textContent = "Error";
    }
  });
}
