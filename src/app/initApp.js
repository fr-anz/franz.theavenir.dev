import { PageShell } from "../components/layout/PageShell.js";
import { initAchievementCarousel } from "../features/achievements/initAchievementCarousel.js";
import { initGithubContributions } from "../features/github/initGithubContributions.js";
import { initGuestbookPhysics } from "../features/guestbook/initGuestbookPhysics.js";
import { initScrollReveal } from "../features/motion/initScrollReveal.js";
import { initHeaderNavigation } from "../features/navigation/initHeaderNavigation.js";
import { HomePage } from "../pages/HomePage.js";
import { initProjectCarousel } from "../features/projects/initProjectCarousel.js";

export function initApp(root) {
  if (!root) {
    throw new Error("Could not find the #app root element.");
  }

  root.innerHTML = PageShell(HomePage());

  initProjectCarousel();
  initAchievementCarousel();
  initGithubContributions();
  initGuestbookPhysics();
  initHeaderNavigation();
  initScrollReveal();
}
