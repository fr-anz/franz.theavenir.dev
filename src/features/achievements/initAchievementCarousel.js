export function initAchievementCarousel(
  carousel = document.querySelector("[data-achievement-carousel]"),
) {
  if (!carousel) return;

  const track = carousel.querySelector("[data-achievement-track]");
  const slides = [...carousel.querySelectorAll("[data-achievement-slide]")];
  const dots = [...carousel.querySelectorAll("[data-achievement-dot]")];

  if (!track || slides.length === 0) return;

  let activeIndex = 0;
  let autoplayId;

  function renderCarousel() {
    track.style.transform = `translateX(-${activeIndex * 100}%)`;

    slides.forEach((slide, index) => {
      slide.setAttribute("aria-hidden", String(index !== activeIndex));
    });

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
      dot.tabIndex = isActive ? 0 : -1;
    });
  }

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    renderCarousel();
  }

  function stopAutoplay() {
    window.clearInterval(autoplayId);
  }

  function startAutoplay() {
    stopAutoplay();
    if (
      slides.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    autoplayId = window.setInterval(() => showSlide(activeIndex + 1), 5000);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startAutoplay();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) startAutoplay();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  renderCarousel();
  startAutoplay();
}
