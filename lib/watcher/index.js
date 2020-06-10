const path = require("path");
const normalize = require("normalize-path");
const watch = require("glob-watcher");
const {exec} = require("child_process");

let watchSubscribers = [];
function subscribeWatch(onStaticChanged) {
  watchSubscribers = [...watchSubscribers, onStaticChanged];
}
function unsubscribeWatch(onStaticChanged) {
  watchSubscribers = watchSubscribers.filter((el) => el !== onStaticChanged);
}

if (process.env.NODE_ENV !== "production") {
  const watchPath = normalize(
    path.resolve(__dirname, "../..") + "/front/**/*.*"
  );
  console.log(`watching ${watchPath}`);

  watch(watchPath, function (done) {
    console.log(`Static has changed.`);
    exec("node ./node_modules/gulp-cli/bin/gulp.js build", (err, stdout, stderr) => {
      if (err) return console.error(`exec error: ${error}`);

      console.log(`node ./node_modules/gulp-cli/bin/gulp.js build`);
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);

      for (const onStaticChanged of watchSubscribers) {
        onStaticChanged();
      }
      console.log(
        "sent reload message to subscibers:",
        watchSubscribers.length
      );
      done();
    });
  });
}

const watcher = {
  subscribe: subscribeWatch,
  unsubscribe: unsubscribeWatch
};

module.exports = watcher;
