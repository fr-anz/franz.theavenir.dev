export function initProjectCarousel(
  carousel = document.querySelector("[data-project-carousel]"),
) {
  if (!carousel) return;

  const track = carousel.querySelector(".project-grid");
  let pointer = null;
  let suppressClick = false;

  // Touch and trackpad gestures use the browser's native scrolling and snapping.
  track.addEventListener("pointerdown", (event) => {
    suppressClick = false;
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    pointer = {
      id: event.pointerId,
      x: event.clientX,
      scroll: track.scrollLeft,
    };
  });

  track.addEventListener("pointermove", (event) => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const distance = event.clientX - pointer.x;
    if (!suppressClick && Math.abs(distance) < 6) return;

    suppressClick = true;
    track.classList.add("is-dragging");
    track.setPointerCapture(pointer.id);
    event.preventDefault();
    track.scrollLeft = pointer.scroll - distance;
  });

  function finishDrag() {
    if (!pointer) return;
    const id = pointer.id;
    pointer = null;
    track.classList.remove("is-dragging");
    if (track.hasPointerCapture(id)) track.releasePointerCapture(id);
  }

  track.addEventListener("pointerup", finishDrag);
  track.addEventListener("pointercancel", finishDrag);
  track.addEventListener("lostpointercapture", finishDrag);
  track.addEventListener("pointerleave", () => {
    if (!suppressClick) finishDrag();
  });
  track.addEventListener("dragstart", (event) => event.preventDefault());
  track.addEventListener(
    "click",
    (event) => {
      if (!suppressClick || event.detail === 0) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    },
    true,
  );
}
