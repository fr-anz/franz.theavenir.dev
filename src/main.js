import { initApp } from "./app/initApp.js";
import "./styles/index.css";
// Keep the contact stylesheet as a direct module import so Vite resolves it
// relative to this source file during local development.
import "./styles/contact.css";

initApp(document.querySelector("#app"));
