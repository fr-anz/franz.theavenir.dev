import { PageShell } from "../components/layout/PageShell.js";
import {
  initTicketStack,
  initPunchCard,
} from "../features/widgets/DeskWidgets.js";
import { initGuestbookPhysics } from "../features/guestbook/initGuestbookPhysics.js";
import { initScrollReveal } from "../features/motion/initScrollReveal.js";
import { initHeaderNavigation } from "../features/navigation/initHeaderNavigation.js";
import { HomePage } from "../pages/HomePage.js";
import { initProjectCarousel } from "../features/projects/initProjectCarousel.js";
import { initColorMode } from "../features/appearance/initColorMode.js";

export function initApp(root) {
  if (!root) {
    throw new Error("Could not find the #app root element.");
  }

  root.innerHTML = PageShell(HomePage());
  initColorMode();

  initProjectCarousel();
  initTicketStack(root);
  initPunchCard(root);
  initGuestbookPhysics();
  initHeaderNavigation();
  initScrollReveal();
}
