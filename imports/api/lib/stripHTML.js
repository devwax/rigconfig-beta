export function stripHTML(str) {
  return str && str.replace(/<(?:.|\n)*?>/gm, '');
}
