const gulp = require("gulp");

const clean = require(`./gulp/clean`);
const copy = require(`./gulp/copy`);
const html = require(`./gulp/html`);
const style = require(`./gulp/style`);
const script = require(`./gulp/script`);
const validateHTML = require(`./gulp/validate-html`);

const build = gulp.series(clean, copy, html, style, script);
const validate = gulp.series(clean, copy, html, validateHTML);

module.exports = {
  build,
  validate,
  clean,
  copy,
  html,
  style,
  script
};
