/**
 * Adds simple 2D physics to the swans inside the jar.
 */
export function initGuestbookPhysics(
  root = document.querySelector("[data-guestbook-jar]"),
) {
  if (!root) return () => {};

  const playArea = root.querySelector(".jar-swans");
  const swanElements = [...root.querySelectorAll(".swan")];

  if (!playArea || swanElements.length === 0) return () => {};

  const bodies = swanElements.map((element, index) => ({
    element,
    x: 0,
    y: -index * 35,
    vx: (Math.random() - 0.5) * 1.4,
    vy: Math.random() * 1.5,
    width: element.offsetWidth,
    height: element.offsetHeight,
  }));

  let areaWidth = 0;
  let areaHeight = 0;
  let animationFrame;
  let previousTime;

  function measurePlayArea() {
    areaWidth = playArea.clientWidth;
    areaHeight = playArea.clientHeight;

    bodies.forEach((body) => {
      body.width = body.element.offsetWidth;
      body.height = body.element.offsetHeight;
      body.x = Math.max(0, Math.min(body.x, areaWidth - body.width));
      body.y = Math.max(0, Math.min(body.y, areaHeight - body.height));
    });
  }

  function resolveSwanCollision(first, second) {
    const firstCenterX = first.x + first.width / 2;
    const firstCenterY = first.y + first.height / 2;
    const secondCenterX = second.x + second.width / 2;
    const secondCenterY = second.y + second.height / 2;

    const dx = secondCenterX - firstCenterX;
    const dy = secondCenterY - firstCenterY;
    const distance = Math.hypot(dx, dy) || 0.001;
    const minimumDistance = (first.width + second.width) * 0.38;

    if (distance >= minimumDistance) return;

    const normalX = dx / distance;
    const normalY = dy / distance;
    const overlap = minimumDistance - distance;

    first.x -= normalX * overlap * 0.5;
    first.y -= normalY * overlap * 0.5;
    second.x += normalX * overlap * 0.5;
    second.y += normalY * overlap * 0.5;

    const relativeSpeed =
      (second.vx - first.vx) * normalX + (second.vy - first.vy) * normalY;

    if (relativeSpeed < 0) {
      const bounce = relativeSpeed * 0.35;
      first.vx += normalX * bounce;
      first.vy += normalY * bounce;
      second.vx -= normalX * bounce;
      second.vy -= normalY * bounce;
    }
  }

  function renderBody(body) {
    body.element.style.transform = `translate3d(${body.x}px, ${body.y}px, 0)`;
  }

  function animate(currentTime) {
    if (!previousTime) previousTime = currentTime;

    const timeScale = Math.min((currentTime - previousTime) / 16.67, 2);
    previousTime = currentTime;

    bodies.forEach((body) => {
      body.vy += 0.35 * timeScale;
      body.x += body.vx * timeScale;
      body.y += body.vy * timeScale;

      if (body.x <= 0) {
        body.x = 0;
        body.vx = Math.abs(body.vx) * 0.55;
      }

      if (body.x + body.width >= areaWidth) {
        body.x = areaWidth - body.width;
        body.vx = -Math.abs(body.vx) * 0.55;
      }

      if (body.y + body.height >= areaHeight) {
        body.y = areaHeight - body.height;
        body.vy = Math.abs(body.vy) > 0.5 ? -Math.abs(body.vy) * 0.32 : 0;
        body.vx *= 0.96;
      }
    });

    for (let firstIndex = 0; firstIndex < bodies.length; firstIndex += 1) {
      for (
        let secondIndex = firstIndex + 1;
        secondIndex < bodies.length;
        secondIndex += 1
      ) {
        resolveSwanCollision(bodies[firstIndex], bodies[secondIndex]);
      }
    }

    bodies.forEach((body) => {
      body.x = Math.max(0, Math.min(body.x, areaWidth - body.width));
      body.y = Math.max(0, Math.min(body.y, areaHeight - body.height));
      renderBody(body);
    });

    animationFrame = requestAnimationFrame(animate);
  }

  function showNote(event) {
    const encodedNote = event.currentTarget.dataset.note;

    try {
      const note = JSON.parse(decodeURIComponent(encodedNote));
      window.alert(`${note.author}:\n\n${note.message}`);
    } catch {
      console.error("Could not read this guestbook note.");
    }
  }

  swanElements.forEach((swan) => swan.addEventListener("click", showNote));

  measurePlayArea();
  bodies.forEach((body) => {
    body.x = Math.random() * Math.max(0, areaWidth - body.width);
    body.y = Math.random() * Math.max(0, areaHeight - body.height) * 0.45;
    renderBody(body);
  });

  const resizeObserver = new ResizeObserver(measurePlayArea);
  resizeObserver.observe(playArea);
  animationFrame = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(animationFrame);
    resizeObserver.disconnect();
    swanElements.forEach((swan) => swan.removeEventListener("click", showNote));
  };
}
