const gulp = require(`gulp`);

module.exports = function copy() {
  return gulp
    .src(
      [
        `front/fonts/**/*.{woff,woff2}`,
        `front/img/**/*.{jpg,webp,png,svg}`,
        `front/*.ico`
      ],
      {
        base: `front`
      }
    )
    .pipe(gulp.dest(`public`));
};
