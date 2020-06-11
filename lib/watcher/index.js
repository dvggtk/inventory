const {build} = require("../../gulpfile");

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

  watch(watchPath, function (watcherDone) {
    console.log(`Static has changed.`);
    build(() => {
      for (const onStaticChanged of watchSubscribers) {
        onStaticChanged();
      }

      console.log(
        "sent reload message to subscibers:",
        watchSubscribers.length
      );

      watcherDone();
    });
  });
}

const watcher = {
  subscribe: subscribeWatch,
  unsubscribe: unsubscribeWatch
};

module.exports = watcher;
