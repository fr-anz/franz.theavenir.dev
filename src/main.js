import { initApp } from "./app/initApp.js";
import "./styles/index.css";
// Keep the contact stylesheet as a direct module import so Vite resolves it
// relative to this source file during local development.
import "./styles/contact.css";

if (new URLSearchParams(window.location.search).get("preview") === "widgets") {
  const { initWidgetPreview } = await import("./pages/WidgetPreview.js");
  initWidgetPreview(document.querySelector("#app"));
} else {
  initApp(document.querySelector("#app"));
}
