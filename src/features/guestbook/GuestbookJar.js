const swanChoices = [
  { name: "White", image: "/images/swans/swan.png" },
  { name: "Black", image: "/images/swans/swan-black.png" },
  { name: "Blue", image: "/images/swans/swan-blue.png" },
  { name: "Green", image: "/images/swans/swan-green.png" },
  { name: "Pink", image: "/images/swans/swan-pink.png" },
  { name: "Red", image: "/images/swans/swan-red.png" },
  { name: "Yellow", image: "/images/swans/swan-yellow.png" },
];

export function GuestbookJar(notes = []) {
  const swans = notes
    .map((note, index) => {
      const image = swanChoices[index % swanChoices.length].image;
      const encodedNote = encodeURIComponent(JSON.stringify(note));

      return `
        <button
          type="button"
          class="swan"
          data-note="${encodedNote}"
          aria-label="Open note from ${note.author}"
        >
          <img src="${image}" alt="" width="588" height="406" />
        </button>
      `;
    })
    .join("");

  const colorOptions = swanChoices
    .map(
      ({ name, image }, index) => `
        <label class="swan-color-option">
          <input
            class="swan-color-input"
            type="radio"
            name="swanColor"
            value="${image}"
            aria-label="${name} swan"
            ${index === 0 ? "checked" : ""}
          />
          <span class="swan-color-swatch" aria-hidden="true">
            <img src="${image}" alt="" width="588" height="406" />
          </span>
        </label>
      `,
    )
    .join("");

  return `
    <div class="guestbook-display" data-guestbook-display>
      <form class="guestbook-note" data-guestbook-form>
        <div class="guestbook-note-field">
          <label class="guestbook-note-label" for="guestbook-author">
            From:
          </label>
          <input
            class="guestbook-note-input"
            id="guestbook-author"
            name="author"
            type="text"
            maxlength="40"
            autocomplete="name"
            required
          />
        </div>

        <div class="guestbook-note-field">
          <label class="guestbook-note-label" for="guestbook-message">
            Msg:
          </label>
          <textarea
            class="guestbook-note-input guestbook-note-message"
            id="guestbook-message"
            name="message"
            maxlength="250"
            rows="4"
            required
          ></textarea>
        </div>

        <!-- Bots often fill every input; humans never see this honeypot. -->
        <input
          class="guestbook-honeypot"
          name="website"
          type="text"
          tabindex="-1"
          autocomplete="off"
          aria-hidden="true"
        />

        <fieldset class="guestbook-color-field">
          <legend class="guestbook-note-label">Pick your swan:</legend>
          <div class="swan-color-picker">
            ${colorOptions}
          </div>
        </fieldset>

        <div class="guestbook-note-actions">
          <p
            class="guestbook-form-status"
            data-guestbook-status
            aria-live="polite"
          ></p>
          <button class="guestbook-submit" type="submit">Put in jar</button>
        </div>
      </form>

      <div class="guestbook-jar" data-guestbook-jar>
        <div class="jar-swans">
          ${swans}
        </div>

        <img class="jar-art" src="/images/jar.png" alt="Guestbook jar" />

        <button
          class="guestbook-motion-toggle"
          type="button"
          data-guestbook-motion
          hidden
        >
          Enable tilt & shake
        </button>
      </div>

      <dialog
        class="guestbook-modal"
        data-guestbook-modal
        aria-labelledby="guestbook-modal-author"
      >
        <article class="guestbook-modal-paper">
          <button
            class="guestbook-modal-close"
            type="button"
            data-guestbook-modal-close
            aria-label="Close note"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              aria-hidden="true"
            >
              <path d="M5 5L19 19M19 5L5 19" />
            </svg>
          </button>

          <p class="guestbook-modal-kicker">A note from</p>
          <h3
            class="guestbook-modal-author"
            id="guestbook-modal-author"
            data-guestbook-modal-author
          ></h3>
          <div class="guestbook-modal-rule" aria-hidden="true"></div>
          <p
            class="guestbook-modal-message"
            data-guestbook-modal-message
          ></p>
        </article>
      </dialog>
    </div>
  `;
}
