import { Button } from "../components/ui/Button.js";
import { WorkCard } from "../components/ui/WorkCard.js";

const workItems = [
  {
    title: "Binty",
    description:
      "Binty is a mobile application that combines real-time health monitoring, AI-powered routine generation, culturally relevant meal planning, and gentle behavioral nudges to help users build sustainable healthy habits",
    projectLink: "",
    sourceLink: "https://github.com/Badoobi/binty",
    image: "/images/projects/binty.jpg",
  },
  {
    title: "StudyOS",
    description:
      "A study planner that turns uploaded learning materials, deadlines, and availability into a focused, realistic study plan students can actually follow.",
    projectLink: "http://study-os-dusky.vercel.app/",
    sourceLink: "https://github.com/fr-anz/StudyOS",
    image: "/images/projects/studyos.png",
  },
  {
    title: "Meowmalize",
    description:
      "An information management study helper that simulates database normalization processes",
    projectLink: "http://meowmalize.railway.app",
    sourceLink: "https://github.com/fr-anz/Meowmalize",
    image: "/images/projects/meowmalize.png",
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
        ${workCard}
        </div>
      </div>
    </section>

    <section class="github container"></section>
  `;
}
