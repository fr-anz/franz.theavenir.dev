const swanColors = [
  "/images/swans/swan.png",
  "/images/swans/swan-black.png",
  "/images/swans/swan-blue.png",
  "/images/swans/swan-green.png",
  "/images/swans/swan-pink.png",
  "/images/swans/swan-red.png",
  "/images/swans/swan-yellow.png",
];

export function GuestbookJar(notes = []) {
  const swans = notes
    .map((note, index) => {
      const image = swanColors[index % swanColors.length];
      const encodedNote = encodeURIComponent(JSON.stringify(note));

      return `
        <button
          class="swan"
          data-note="${encodedNote}"
          aria-label="Open note from ${note.author}"
        >
          <img src="${image}" alt="Note from ${note.author}" />
        </button>
      `;
    })
    .join("");

  return `
    <div class="guestbook-jar" data-guestbook-jar>
      <div class="jar-swans">
        ${swans}
      </div>

      <img class="jar-art" src="/images/jar.png" alt="Guestbook jar" />
    </div>
  `;
}
