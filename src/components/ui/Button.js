export function Button({ label, variant = "primary", type = "button" } = {}) {
  return /* HTML */ `
    <button type="${type}" class="button button--${variant}">${label}</button>
  `;
}
