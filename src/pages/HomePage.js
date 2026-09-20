import { Icon } from "../components/ui/Icon.js";
import { site } from "../content/site.js";
import { achievements } from "../content/achievements.js";
import { guestbookNotes } from "../content/guestbookNotes.js";
import { projects } from "../content/projects.js";
import { AchievementCard } from "../features/achievements/AchievementCard.js";
import { ContactSection } from "../features/contact/ContactSection.js";
import { GithubContributions } from "../features/github/GithubContributions.js";
import { GuestbookJar } from "../features/guestbook/GuestbookJar.js";
import { WorkCard } from "../features/projects/WorkCard.js";

export function HomePage() {
  const workCards = projects.map((work) => WorkCard(work)).join("");
  const achievementSlides = achievements
    .map((achievement, index) => AchievementCard({ ...achievement, index }))
    .join("");
  const achievementDots = achievements
    .map(
      (_, index) => /* HTML */ `
        <button
          class="achievement-dot${index === 0 ? " is-active" : ""}"
          type="button"
          data-achievement-dot
          role="tab"
          aria-label="Show achievement ${index + 1}"
          aria-selected="${index === 0}"
          aria-controls="achievement-slide-${index}"
          tabindex="${index === 0 ? "0" : "-1"}"
        ></button>
      `,
    )
    .join("");

  return /* HTML */ `
    <section class="hero container" id="about">
      <figure class="portrait img">
        <img
          src="./images/portrait.jpg"
          alt="Portrait of Franz Emmanuel Baes"
          fetchpriority="high"
        />
        <figcaption>
          <span>A WORK IN PROGRESS.</span
          ><span>JUST LIKE EVERYTHING GOOD.</span>
        </figcaption>
      </figure>

      <div class="hero-content">
        <h1>Ideas into things.<br />One build at a time.</h1>
        <p>
          I’m an aspiring full-stack engineer who enjoys building applications
          that turn complex ideas into practical, scalable products. I regularly
          participate in hackathons, where I collaborate with teams to transform
          early concepts into working solutions.
        </p>
        <div class="hero-buttons">
          <a class="button button--primary" href="mailto:${site.email}">
            Email me ${Icon("mail")}
          </a>
          <a class="button hero-projects-link" href="#projects">
            Explore the work ${Icon("arrowDown")}
          </a>
        </div>
        <div class="receipt-bottom">
          <span>ALWAYS LEARNING. ALWAYS MAKING.</span
          ><span>THANK YOU FOR STOPPING BY.</span>
        </div>
      </div>

      <div class="hero-widgets">
        <section
          class="achievements hero-widget"
          aria-labelledby="achievements-title"
        >
          <h2 id="achievements-title">Small wins</h2>

          <div class="achievement-carousel" data-achievement-carousel>
            <div class="achievement-viewport" aria-live="polite">
              <div class="achievement-track" data-achievement-track>
                ${achievementSlides}
              </div>
              <div
                class="achievement-dots"
                role="tablist"
                aria-label="Achievement slides"
              >
                ${achievementDots}
              </div>
            </div>
          </div>
        </section>
        ${GithubContributions()}
      </div>
    </section>

    <section class="work-selection container" id="projects">
      <div class="work-text">
        <div>
          <h2>Proof of work.</h2>
        </div>
        <a
          class="view-button"
          href="https://github.com/fr-anz"
          target="_blank"
          rel="noreferrer"
          >All projects ${Icon("arrowUpRight")}</a
        >
      </div>
      <div class="project-carousel" data-project-carousel>
        <div
          class="project-grid"
          id="project-receipts"
          tabindex="0"
          role="region"
          aria-label="Project receipts"
        >
          ${workCards}
        </div>
      </div>
    </section>

    <section class="guestbook container" id="guestbook">
      <h2>Leave a little trace.</h2>
      <p class="section-note">
        A note, a paper swan, a small reminder you stopped by.
      </p>
      ${GuestbookJar(guestbookNotes)}
    </section>

    ${ContactSection()}
  `;
}
