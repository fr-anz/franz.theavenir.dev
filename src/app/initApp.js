import { PageShell } from "../components/layout/PageShell.js";
import { initCopyEmail } from "../features/contact/initCopyEmail.js";
import { initAchievementCarousel } from "../features/achievements/initAchievementCarousel.js";
import { initGithubContributions } from "../features/github/initGithubContributions.js";
import { initGuestbookPhysics } from "../features/guestbook/initGuestbookPhysics.js";
import { initProjectCarousel } from "../features/projects/initProjectCarousel.js";
import { HomePage } from "../pages/HomePage.js";

export function initApp(root) {
  if (!root) {
    throw new Error("Could not find the #app root element.");
  }

  root.innerHTML = PageShell(HomePage());

  initCopyEmail();
  initProjectCarousel();
  initAchievementCarousel();
  initGithubContributions();
  initGuestbookPhysics();
}
