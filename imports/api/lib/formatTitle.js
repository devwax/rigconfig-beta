export function formatTitle(text) {
  return text ? text.split("_").join(" ").toUpperCase() : ''
}
