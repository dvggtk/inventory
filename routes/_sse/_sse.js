const express = require("express");
const router = express.Router();

const watcher = require("../../lib/watcher");

router.get("/", function (req, res, next) {
  if (String(req.app.get("env")).toLowerCase() === "production") return next();

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache"
  });

  const onStaticChanged = () => {
    const message = "data: reload";
    res.write(message + "\n\n");
  };

  watcher.subscribe(onStaticChanged);

  res.on("close", function close() {
    watcher.unsubscribe(onStaticChanged);
  });
});

module.exports = router;
