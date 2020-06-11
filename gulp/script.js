const gulp = require(`gulp`);
const rollup = require("gulp-rollup");
const sourcemaps = require("gulp-sourcemaps");
const terser = require("rollup-plugin-terser").terser;

let rollupPlugins = [];
if (process.env.NODE_ENV === "production") {
  rollupPlugins = [terser()];
}

function script() {
  return (
    gulp
      .src("./front/js/**/*.js")
      .pipe(sourcemaps.init())
      // transform the files here.
      .pipe(
        rollup({
          input: ["./front/js/index.js", "./front/js/_sse.js"],
          output: {
            format: "cjs"
          },
          plugins: rollupPlugins
        })
      )
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("./public"))
  );
}

module.exports = script;
