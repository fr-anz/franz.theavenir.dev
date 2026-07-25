export function Button({
  label,
  variant = "primary",
  type = "button",
  id = "",
} = {}) {
  return /* HTML */ `
    <button type="${type}" class="button button--${variant}" id="${id}">
      ${label}
    </button>
  `;
}
