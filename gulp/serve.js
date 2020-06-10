const gulp = require(`gulp`);
const server = require(`browser-sync`).create();

const copy = require(`./copy`);
const style = require(`./style`);
const html = require(`./html`);
const script = require(`./script`);

function readyFullReload(cb) {
  server.reload();
  cb(null);
}

function readyStyleReload(cb) {
  return gulp.src("public/css").pipe(server.stream()).on("end", cb);
}

module.exports = function serve() {
  server.init({
    server: `public/`,
    port: 4000,
    notify: false,
    open: true,
    cors: true,
    // ui: false
    ui: {
      port: 8080
    }
  });

  gulp.watch(`front/**/*.html`, gulp.series(html, readyFullReload));

  gulp.watch(`front/js/**/*.js`, gulp.series(script, readyFullReload));
  gulp.watch(`front/img/**/*.*`, gulp.series(copy, readyFullReload));
};
