const express = require("express");
const router = express.Router();

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

router.get("/img/:imgfile", function (req, res, next) {
  const imgfile = req.params.imgfile;
  const pathname = path.resolve(__dirname, "../storage/db/img/", imgfile);

  fs.createReadStream(pathname).pipe(res);
});

module.exports = router;
