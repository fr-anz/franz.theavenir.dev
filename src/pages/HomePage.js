import { Button } from "../components/ui/Button.js";
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
    <section class="hero container">
      <div class="portrait img">
        <img src="./images/portrait.jpg" />
      </div>

      <div class="hero-content">
        <h1>Franz Emmanuel Baes</h1>

        <p>
          I am an aspiring full-stack engineer. I enjoy learning
          through building applications that make complex ideas simple.
          <br></br>
          as of the moment, i love participating in hackathons with the mindset of turning concepts into tangible solutions.
        </p>
        <div class="hero-buttons">
          ${Button({ label: "email me", id: "copy-email" })}
        </div>
      </div>
    </section>
    <section class="achievements-github-grid container">
      <section class="achievements" aria-labelledby="achievements-title">
        <h2 id="achievements-title">Achievements</h2>

        <div class="achievement-carousel" data-achievement-carousel>
          <div class="achievement-viewport" aria-live="polite">
            <div class="achievement-track" data-achievement-track>
              ${achievementSlides}
            </div>
            <div class="achievement-dots" role="tablist" aria-label="Achievement slides">
              ${achievementDots}
            </div>
          </div>
        </div>
      </section>
      ${GithubContributions()}
    </section>

    <section class="work-selection container">
     <div class="work-text"> <h2>Featured Projects</h2>
       <a class="view-button" href="/projects"><span> View All Project </span></a>
       </div>
      <div class="work-carousel" data-carousel>
      <div class="carousel-stage">
        ${workCards}
        </div>
      </div>
    </section>

    ${ContactSection()}

    <section class="guestbook container">
      <h2>Guestbook</h2>
      ${GuestbookJar(guestbookNotes)}
    </section>
  `;
}
