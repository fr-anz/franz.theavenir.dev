import { Icon } from "../components/ui/Icon.js";
import { site } from "../content/site.js";
import { guestbookNotes } from "../content/guestbookNotes.js";
import { projects } from "../content/projects.js";
import { ContactSection } from "../features/contact/ContactSection.js";
import {
  SmallWinsTickets,
  GithubPunchCard,
} from "../features/widgets/DeskWidgets.js";
import { GuestbookJar } from "../features/guestbook/GuestbookJar.js";
import { WorkCard } from "../features/projects/WorkCard.js";

export function HomePage() {
  const workCards = projects.map((work) => WorkCard(work)).join("");
  return /* HTML */ `
    <section class="hero container" id="about">
      <figure class="portrait img">
        <img
          src="./images/portrait.jpg"
          alt="Portrait of Franz Emmanuel Baes"
          fetchpriority="high"
        />
      </figure>

      <div class="hero-content">
        <h1>Franz Emmanuel Baes</h1>
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
        <section class="hero-widget" aria-labelledby="achievements-title">
          <h2 id="achievements-title">Small wins</h2>
          ${SmallWinsTickets()}
        </section>
        <section class="hero-widget" aria-labelledby="github-title">
          <h2 id="github-title">GitHub</h2>
          ${GithubPunchCard()}
        </section>
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
