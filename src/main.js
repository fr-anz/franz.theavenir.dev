import "./styles/global.css";
import "./styles/tokens.css";
import "./styles/layout.css";
import "./styles/pages.css";
import "./styles/utilities.css";
import { HomePage } from "./pages/HomePage";
import { PageShell } from "./components/layout/PageShell";

const app = document.querySelector("#app");

app.innerHTML = PageShell(HomePage());
