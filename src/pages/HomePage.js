import { Button } from "../components/ui/Button.js";
import { WorkCard } from "../components/ui/WorkCard.js";

const workItems = [
  {
    title: "Sample",
    description: "lorem ipsum dolor",
  },
  {
    title: "Sample",
    description: "lorem ipsum dolor",
  },
  {
    title: "Sample",
    description: "lorem ipsum dolor",
  },
];

export function HomePage() {
  const workCard = workItems.map((work) => WorkCard(work)).join("");
  return /* HTML */ `
    <section class="hero container">
      <div class="portrait img">
        <img src="./images/portrait.jpg" />
      </div>

      <div class="hero-content">
        <h1>Franz Emmanuel Baes</h1>
        <div class="hero-buttons">
          ${Button({ label: "email me", id: "copy-email" })}
        </div>
        <p>
          I am an aspiring full-stack engineer. I enjoy learning
          through building applications that make complex ideas simple.
          <br></br>
          as of the moment, i love participating in hackathons with the mindset of turning concepts into tangible solutions.
        </p>

      </div>
    </section>

    <section class="work-selection container">
      <h2>Featured Projects</h2>
      <div class="work-grid">
        ${workCard}

        <a class="view-button" href="/works"> View All Project </a>
      </div>
    </section>
  `;
}
