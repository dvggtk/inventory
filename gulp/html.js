const gulp = require(`gulp`);
const htmlValidator = require("gulp-w3c-html-validator");
const bemValidator = require("gulp-html-bem-validator");

module.exports = function html() {
  return (
    gulp
      .src(`front/**/*.html`)
      // .pipe(htmlValidator())
      // .pipe(bemValidator())
      .pipe(gulp.dest(`public`))
  );
};
