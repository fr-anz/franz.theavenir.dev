export function initProjectCarousel(
  carousel = document.querySelector("[data-carousel]"),
) {
  if (!carousel) return;

  const cards = [...carousel.querySelectorAll("[data-carousel-card]")];
  const stage = carousel.querySelector(".carousel-stage");
  const mobileQuery = window.matchMedia("(max-width: 767px)");
  let activeIndex = 0;
  let pointerStart = null;
  let suppressNextClick = false;

  if (!cards.length || !stage) return;

  /*
   * Indicators are created from the available cards so additions to the
   * project data automatically receive a matching control.
   */
  const indicators = document.createElement("div");
  indicators.className = "work-carousel-dots";
  indicators.setAttribute("role", "tablist");
  indicators.setAttribute("aria-label", "Featured project slides");

  const dots = cards.map((card, index) => {
    const cardId = card.id || `featured-project-${index + 1}`;
    const dot = document.createElement("button");

    card.id = cardId;
    dot.className = "work-carousel-dot";
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-controls", cardId);
    dot.setAttribute("aria-label", `Show project ${index + 1}`);
    dot.addEventListener("click", () => {
      activeIndex = index;
      renderCarousel();
    });
    dot.addEventListener("keydown", (event) => {
      const keyOffsets = {
        ArrowLeft: -1,
        ArrowRight: 1,
      };

      if (!(event.key in keyOffsets)) return;

      event.preventDefault();
      setActiveProject(activeIndex + keyOffsets[event.key]);
      dots[activeIndex].focus();
    });

    indicators.append(dot);
    return dot;
  });

  carousel.append(indicators);
  stage.setAttribute("aria-live", "polite");

  function setActiveProject(nextIndex) {
    activeIndex = (nextIndex + cards.length) % cards.length;
    renderCarousel();
  }

  function renderCarousel() {
    cards.forEach((card, index) => {
      const position = (index - activeIndex + cards.length) % cards.length;
      const isActive = index === activeIndex;

      card.classList.toggle("is-active", position === 0);
      card.classList.toggle("is-next", position === 1);
      card.classList.toggle("is-prev", position === cards.length - 1);

      /*
       * Desktop exposes the neighboring cards as controls. Mobile visually
       * hides them, so inert also keeps their links out of the tab sequence.
       */
      card.inert = mobileQuery.matches && !isActive;
      if (mobileQuery.matches) {
        card.setAttribute("aria-hidden", String(!isActive));
      } else {
        card.removeAttribute("aria-hidden");
      }

      dots[index].classList.toggle("is-active", isActive);
      dots[index].setAttribute("aria-selected", String(isActive));
      dots[index].tabIndex = isActive ? 0 : -1;
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

  /*
   * Pointer gestures are limited to touch and pen input. Keeping `pan-y` in
   * CSS lets visitors scroll the page normally until a horizontal swipe wins.
   */
  stage.addEventListener("pointerdown", (event) => {
    if (!mobileQuery.matches || event.pointerType === "mouse") return;

    pointerStart = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  });

  stage.addEventListener("pointerup", (event) => {
    if (!pointerStart || event.pointerId !== pointerStart.pointerId) return;

    const distanceX = event.clientX - pointerStart.x;
    const distanceY = event.clientY - pointerStart.y;
    const isHorizontalSwipe =
      Math.abs(distanceX) >= 44 && Math.abs(distanceX) > Math.abs(distanceY);

    pointerStart = null;
    if (!isHorizontalSwipe) return;

    suppressNextClick = true;
    setActiveProject(activeIndex + (distanceX < 0 ? 1 : -1));

    /*
     * Some browsers do not dispatch a click after a sufficiently long swipe.
     * Release the guard shortly afterward so the next intentional tap works.
     */
    window.setTimeout(() => {
      suppressNextClick = false;
    }, 400);
  });

  stage.addEventListener("pointercancel", () => {
    pointerStart = null;
  });

  /*
   * A completed swipe can otherwise emit a synthetic click on a card link.
   * Suppress only that immediate click and leave ordinary taps untouched.
   */
  carousel.addEventListener(
    "click",
    (event) => {
      if (!suppressNextClick) return;

      event.preventDefault();
      event.stopPropagation();
      suppressNextClick = false;
    },
    true,
  );

  mobileQuery.addEventListener("change", renderCarousel);
  renderCarousel();
}
