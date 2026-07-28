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
  const motionButton = root.querySelector("[data-guestbook-motion]");

  if (!playArea) return () => {};

  const motionTarget = typeof window === "undefined" ? null : window;
  const bodies = [];
  let areaWidth = 0;
  let areaHeight = 0;
  let animationFrame;
  let gravityX = 0;
  let gravityY = 0;
  let gravityZ = 0;
  let hasMotionSample = false;
  let isDeviceMotionListening = false;
  let lastShakeTime = 0;
  let previousTime;
  let previousPointerPosition;
  let tiltX = 0;

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

  function disturbSwans(event) {
    if (event.pointerType && event.pointerType !== "mouse") return;

    const bounds = playArea.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;
    const movementX = previousPointerPosition
      ? pointerX - previousPointerPosition.x
      : event.movementX;
    const movementY = previousPointerPosition
      ? pointerY - previousPointerPosition.y
      : event.movementY;

    previousPointerPosition = { x: pointerX, y: pointerY };

    const pointerSpeed = Math.min(Math.hypot(movementX, movementY), 24);
    if (pointerSpeed < 0.5) return;

    const influenceRadius = Math.max(
      100,
      Math.min(areaWidth, areaHeight) * 0.45,
    );

    bodies.forEach((body) => {
      const dx = body.x + body.width / 2 - pointerX;
      const dy = body.y + body.height / 2 - pointerY;
      const distance = Math.hypot(dx, dy) || 0.001;
      const proximity = Math.max(0, 1 - distance / influenceRadius);
      const movementTransfer = 0.012 + proximity * 0.035;
      const repulsion = proximity * (0.3 + pointerSpeed * 0.04);
      const jitter = pointerSpeed * 0.025;

      body.vx +=
        movementX * movementTransfer +
        (dx / distance) * repulsion +
        (Math.random() - 0.5) * jitter;
      body.vy +=
        movementY * movementTransfer +
        (dy / distance) * repulsion -
        proximity * 0.25 +
        (Math.random() - 0.5) * jitter;

      body.vx = Math.max(-5, Math.min(body.vx, 5));
      body.vy = Math.max(-5, Math.min(body.vy, 5));
    });
  }

  function resetPointerPosition() {
    previousPointerPosition = undefined;
  }

  function handleDeviceMotion(event) {
    const acceleration = event.accelerationIncludingGravity;

    if (
      !acceleration ||
      !Number.isFinite(acceleration.x) ||
      !Number.isFinite(acceleration.y) ||
      !Number.isFinite(acceleration.z)
    ) {
      return;
    }

    if (!hasMotionSample) {
      gravityX = acceleration.x;
      gravityY = acceleration.y;
      gravityZ = acceleration.z;
      hasMotionSample = true;
      return;
    }

    const shakeX = acceleration.x - gravityX;
    const shakeY = acceleration.y - gravityY;
    const shakeZ = acceleration.z - gravityZ;

    gravityX += shakeX * 0.12;
    gravityY += shakeY * 0.12;
    gravityZ += shakeZ * 0.12;
    tiltX = Math.max(-1, Math.min(gravityX / 7, 1));

    const shakeStrength = Math.hypot(shakeX, shakeY, shakeZ);
    const currentTime = performance.now();

    if (
      shakeStrength < 9 ||
      (lastShakeTime && currentTime - lastShakeTime < 250)
    ) {
      return;
    }

    lastShakeTime = currentTime;
    const impulse = Math.min(5, 1.5 + (shakeStrength - 9) * 0.35);

    bodies.forEach((body) => {
      body.vx = Math.max(
        -5,
        Math.min(body.vx + (Math.random() - 0.5) * impulse * 2, 5),
      );
      body.vy = Math.max(-5, Math.min(body.vy - Math.random() * impulse, 5));
    });
  }

  function startDeviceMotion() {
    if (!motionTarget || isDeviceMotionListening) return;

    motionTarget.addEventListener("devicemotion", handleDeviceMotion);
    isDeviceMotionListening = true;
  }

  async function requestDeviceMotionPermission() {
    if (!motionButton || motionButton.disabled) return;

    motionButton.disabled = true;
    motionButton.textContent = "Requesting motion…";

    try {
      const permission = await globalThis.DeviceMotionEvent.requestPermission();

      if (permission === "granted") {
        startDeviceMotion();
        motionButton.hidden = true;
      } else {
        motionButton.textContent = "Motion access denied";
      }
    } catch {
      motionButton.textContent = "Motion unavailable";
    }
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
      body.vx += tiltX * 0.06 * timeScale;
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

  async function readApiResponse(response) {
    const responseText = await response.text();
    let payload = {};

    try {
      payload = responseText ? JSON.parse(responseText) : {};
    } catch {
      payload = {};
    }

    if (!response.ok) {
      throw new Error(
        payload.error || `Guestbook request failed (${response.status}).`,
      );
    }

    return payload;
  }

  async function loadSavedNotes() {
    try {
      const response = await fetch("/api/guestbook", {
        headers: { Accept: "application/json" },
      });

      const notes = await readApiResponse(response);
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
      const result = await readApiResponse(response);

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
  playArea.addEventListener("pointermove", disturbSwans);
  playArea.addEventListener("pointerleave", resetPointerPosition);

  if (typeof globalThis.DeviceMotionEvent?.requestPermission === "function") {
    if (motionButton) {
      motionButton.hidden = false;
      motionButton.addEventListener("click", requestDeviceMotionPermission);
    }
  } else if (globalThis.DeviceMotionEvent) {
    startDeviceMotion();
  }

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
    playArea.removeEventListener("pointermove", disturbSwans);
    playArea.removeEventListener("pointerleave", resetPointerPosition);
    motionButton?.removeEventListener("click", requestDeviceMotionPermission);
    motionTarget?.removeEventListener("devicemotion", handleDeviceMotion);
    if (modal?.open) modal.close();
    bodies.forEach(({ element }) =>
      element.removeEventListener("click", showNote),
    );
  };
}
