import { Button } from "../components/ui/Button.js";
import { guestbookNotes } from "../content/guestbookNotes.js";
import { projects } from "../content/projects.js";
import { GithubContributions } from "../features/github/GithubContributions.js";
import { GuestbookJar } from "../features/guestbook/GuestbookJar.js";
import { WorkCard } from "../features/projects/WorkCard.js";

export function HomePage() {
  const workCards = projects.map((work) => WorkCard(work)).join("");
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

     ${GithubContributions()}
     <section class="guestbook container">
            <h2>Guestbook</h2>
            ${GuestbookJar(guestbookNotes)}
          </section>
  `;
}
