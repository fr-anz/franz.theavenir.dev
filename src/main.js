import "./styles/global.css";
import "./styles/tokens.css";
import "./styles/layout.css";
import "./styles/pages.css";
import "./styles/utilities.css";
import "./styles/components.css";
import { HomePage } from "./pages/HomePage";
import { PageShell } from "./components/layout/PageShell";

const app = document.querySelector("#app");

app.innerHTML = PageShell(HomePage());

const email = "franzemmanuelbaes@gmail.com";

const copyEmail = document.querySelector("#copy-email");

copyEmail?.addEventListener("click", async () => {
  try {
    if (!navigator.clipboard) {
      throw new Error("Clipboard not found");
    }

    await navigator.clipboard.writeText(email);

    copyEmail.textContent = "Email Copied";

    setTimeout(() => {
      copyEmail.textContent = "email me";
    }, 1600);
  } catch {
    copyEmail.textContent = "Error";
  }
});
