require("dotenv").config();

const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const rename = require(`gulp-rename`);
const sourcemap = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const cssImport = require("postcss-import");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");

module.exports = function style() {
  if (process.env.NODE_ENV === "production") {
    return gulp
      .src(`front/css/index.css`)
      .pipe(plumber())
      .pipe(sourcemap.init())
      .pipe(postcss([autoprefixer(), cssImport()]))
      .pipe(csso())
      .pipe(rename(`style.css`))
      .pipe(sourcemap.write(`.`))
      .pipe(gulp.dest(`public/css`));
  }

  return (
    gulp
      .src(`front/css/index.css`)
      .pipe(plumber())
      .pipe(sourcemap.init())
      .pipe(postcss([autoprefixer(), cssImport()]))
      // .pipe(csso())
      .pipe(rename(`style.css`))
      .pipe(sourcemap.write(`.`))
      .pipe(gulp.dest(`public/css`))
  );
};
