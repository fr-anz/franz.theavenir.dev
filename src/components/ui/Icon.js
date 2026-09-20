const iconPaths = {
  arrowUpRight:
    '<path d="M7 17 17 7M7 7h10v10" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>',
  arrowDown:
    '<path d="M12 4v16m-6-6 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>',
  github:
    '<path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.76.84 1.23 1.91 1.23 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/>',
  linkedin:
    '<path d="M5.1 3.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM.3 8h4.6v14.7H.3V8Zm7.5 0h4.4v2h.06c.61-1.15 2.1-2.36 4.34-2.36 4.64 0 5.5 3.05 5.5 7.02v8.04h-4.6v-7.13c0-1.7-.03-3.9-2.37-3.9-2.37 0-2.74 1.85-2.74 3.78v7.25H7.8V8Z"/>',
  twitter:
    '<path d="M18.9 2h3.1l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.24-8.28L3 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.8h1.72L8.46 4.08H6.62L17.8 19.8Z"/>',
  mail: '<path d="M2 4h20v16H2V4Zm2 2v.5l8 5.33 8-5.33V6l-8 5.33L4 6Zm16 12V8.9l-8 5.33-8-5.33V18h16Z"/>',
};

export function Icon(name) {
  return /* HTML */ `
    <svg
      class="contact-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      ${iconPaths[name] || ""}
    </svg>
  `;
}
