const express = require("express");
const router = express.Router();

const etag = require("etag");

const fs = require("fs");
const path = require("path");

const {db} = require("../lib/db");

router.get("/", function (req, res, next) {
  (async () => {
    const docs = await db.allDocs();

    res.render(`equipments`, {equipments: docs});
  })().catch((err) => next(err));
});

router.get("/:uuid", function (req, res, next) {
  const id = req.params.uuid;
  (async () => {
    const doc = await db.get(id);

    if (!doc) return next();

    res.render(`equipment`, {equipment: doc});
  })().catch((err) => next(err));
});

router.get(
  "/img/:imgfile",
  function (req, res, next) {
    const imgfile = req.params.imgfile;
    const filepath = path.resolve(__dirname, "../storage/db/img/", imgfile);

    req.filepath = filepath;
    next();
  },
  sendFile
);

router.get(
  "/img/original/:imgfile",
  function (req, res, next) {
    const imgfile = req.params.imgfile;
    const filepath = path.resolve(
      __dirname,
      "../storage/db/img/original",
      imgfile
    );

    req.filepath = filepath;
    next();
  },
  sendFile
);

function sendFile(req, res, next) {
  const filepath = req.filepath;

  if (!filepath) return next(new Error("Не указан файл для отправки"));
  const filename = filepath.match(/[\\\/]([^\\\/]+)[.][^\\\/]*$/)[1];

  const etagValue = etag(filename);

  res.set({
    // 1. https://engineering.fb.com/web/this-browser-tweak-saved-60-of-requests-to-facebook/
    // 2. https://tools.ietf.org/html/rfc8246#section-2.2
    "Cache-Control": "max-age=31536000, immutable",
    ETag: etagValue
  });

  if (req.headers["if-none-match"] === etagValue) return res.status(304).end();

  fs.createReadStream(filepath)
    .on("error", (err) => {
      if (err.code === "ENOENT") return next();
      return next(err);
    })
    .pipe(res);
}

module.exports = router;
