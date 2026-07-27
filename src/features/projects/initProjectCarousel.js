export function initProjectCarousel(
  carousel = document.querySelector("[data-carousel]"),
) {
  if (!carousel) return;

  const cards = [...carousel.querySelectorAll("[data-carousel-card]")];
  let activeIndex = 0;

  function renderCarousel() {
    cards.forEach((card, index) => {
      const position = (index - activeIndex + cards.length) % cards.length;

      card.classList.toggle("is-active", position === 0);
      card.classList.toggle("is-next", position === 1);
      card.classList.toggle("is-prev", position === cards.length - 1);
    });
  }

  cards.forEach((card, index) => {
    card.addEventListener("click", (event) => {
      if (index === activeIndex) return;

      event.preventDefault();
      activeIndex = index;
      renderCarousel();
    });
  });

  renderCarousel();
}
