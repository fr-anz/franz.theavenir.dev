/**
 * Adds simple 2D physics to the swans and connects the guestbook form.
 *
 * Every swan, including one created after a form submission, is registered as
 * a body through the same function. This keeps click handling, positioning,
 * collision behavior, and cleanup consistent.
 */
export function initGuestbookPhysics(
  root = document.querySelector("[data-guestbook-jar]"),
) {
  if (!root) return () => {};

  const playArea = root.querySelector(".jar-swans");
  const swanElements = [...root.querySelectorAll(".swan")];
  const guestbook = root.closest("[data-guestbook-display]");
  const form = guestbook?.querySelector("[data-guestbook-form]");
  const status = guestbook?.querySelector("[data-guestbook-status]");
  const submitButton = form?.querySelector("[type='submit']");
  const modal = guestbook?.querySelector("[data-guestbook-modal]");
  const modalAuthor = guestbook?.querySelector("[data-guestbook-modal-author]");
  const modalMessage = guestbook?.querySelector(
    "[data-guestbook-modal-message]",
  );
  const modalClose = guestbook?.querySelector("[data-guestbook-modal-close]");

  if (!playArea) return () => {};

  const bodies = [];
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

  /**
   * Registers an existing button as a physics body. New submissions start at
   * the top of the jar so the visitor can see their swan drop into the pile.
   */
  function registerSwan(element, { dropFromTop = false } = {}) {
    const body = {
      element,
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 1.4,
      vy: Math.random() * 1.5,
      width: element.offsetWidth,
      height: element.offsetHeight,
    };

    body.x = Math.random() * Math.max(0, areaWidth - body.width);
    body.y = dropFromTop
      ? 0
      : Math.random() * Math.max(0, areaHeight - body.height) * 0.45;

    element.addEventListener("click", showNote);
    bodies.push(body);
    renderBody(body);
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

      if (!modal || !modalAuthor || !modalMessage) return;

      // textContent keeps visitor-provided messages as text rather than HTML.
      modalAuthor.textContent = note.author;
      modalMessage.textContent = note.message;

      if (!modal.open) modal.showModal();
    } catch {
      console.error("Could not read this guestbook note.");
    }
  }

  function closeNoteModal() {
    modal?.close();
  }

  function closeNoteFromBackdrop(event) {
    // Native dialogs close with Escape. This adds the familiar backdrop-click
    // behavior without treating clicks on the paper itself as close requests.
    if (event.target === modal) closeNoteModal();
  }

  /**
   * Creates DOM nodes instead of interpolating visitor input into HTML. The
   * note is encoded only for storage on the button and is decoded on click.
   */
  function createSwan(note, imageSource, { dropFromTop = false } = {}) {
    const swan = document.createElement("button");
    const image = document.createElement("img");

    swan.type = "button";
    swan.className = "swan";
    swan.dataset.note = encodeURIComponent(JSON.stringify(note));
    swan.setAttribute("aria-label", `Open note from ${note.author}`);

    image.src = imageSource;
    image.alt = "";
    image.width = 588;
    image.height = 406;

    swan.append(image);
    playArea.append(swan);
    registerSwan(swan, { dropFromTop });
  }

  async function loadSavedNotes() {
    try {
      const response = await fetch("/api/guestbook", {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Could not load guest notes.");

      const notes = await response.json();
      notes.forEach((note) => {
        createSwan(note, note.swanColor);
      });
    } catch {
      if (status) {
        status.textContent = "Saved notes are unavailable right now.";
      }
    }
  }

  async function submitNote(event) {
    event.preventDefault();

    if (!form || submitButton?.disabled) return;

    const formData = new FormData(form);
    const author = String(formData.get("author") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const imageSource = String(formData.get("swanColor") ?? "");

    // Native validation handles empty fields; this also rejects whitespace-only
    // content before a new physics body is created.
    if (!author || !message || !imageSource) {
      if (status) status.textContent = "Please complete your note.";
      return;
    }

    if (submitButton) submitButton.disabled = true;
    form.setAttribute("aria-busy", "true");

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author,
          message,
          swanColor: imageSource,
          website: formData.get("website"),
        }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Could not save note.");

      createSwan(result.note, result.note.swanColor, { dropFromTop: true });
      form.reset();

      if (status) status.textContent = "Your swan is in the jar.";
    } catch (error) {
      if (status) status.textContent = error.message;
    } finally {
      if (submitButton) submitButton.disabled = false;
      form.removeAttribute("aria-busy");
    }
  }

  measurePlayArea();
  swanElements.forEach((swan) => registerSwan(swan));
  form?.addEventListener("submit", submitNote);
  modalClose?.addEventListener("click", closeNoteModal);
  modal?.addEventListener("click", closeNoteFromBackdrop);
  void loadSavedNotes();

  const resizeObserver = new ResizeObserver(measurePlayArea);
  resizeObserver.observe(playArea);
  animationFrame = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(animationFrame);
    resizeObserver.disconnect();
    form?.removeEventListener("submit", submitNote);
    modalClose?.removeEventListener("click", closeNoteModal);
    modal?.removeEventListener("click", closeNoteFromBackdrop);
    if (modal?.open) modal.close();
    bodies.forEach(({ element }) =>
      element.removeEventListener("click", showNote),
    );
  };
}
