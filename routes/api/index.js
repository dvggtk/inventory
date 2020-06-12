const express = require("express");
const router = express.Router();

//TODO check https://www.npmjs.com/package/express-fileupload
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage, limits: {fileSize: 10 * 1024 * 1024}});

const fs = require("fs");
const path = require("path");

const {db} = require("../../lib/db");
const {uuid} = require("../../lib/utils");

const IMAGE_BASE = "/equipments/img/";
const IMAGE_DB_PATH = path.resolve(__dirname, "../..", "storage/db/img"); //TODO сделать config для путей

router.get("/", function (req, res, next) {
  (async () => {
    const docs = await db.allDocs();

    for (const doc of docs) {
      doc.images = doc.images.map((image) => {
        const url = IMAGE_BASE + image.filename;
        return {url};
      });
    }

    res.json(docs);
  })().catch((err) => next(err));
});

// Удалить фото
router.delete("/:eqUuid/images/:filename", function (req, res, next) {
  const {eqUuid, filename} = req.params;

  (async () => {
    const doc = await db.get(eqUuid);
    const image = doc.images.find((img) => img.filename === filename);

    if (!image) return next();

    doc.images = doc.images.filter((img) => img !== image);

    await db.put(doc);

    try {
      imgPath = path.resolve(IMAGE_DB_PATH, filename);
      await fs.promises.unlink(imgPath);
    } catch (err) {}

    res.json(doc);
  })().catch((err) => next(err));
});

// Добавить фото
router.post("/:eqUuid/images", upload.single("image"), function (
  req,
  res,
  next
) {
  (async () => {
    const files = await fs.promises.readdir(IMAGE_DB_PATH);

    //FIXME временное ограничение количества фото в базе данных
    if (files.length > 20) throw Error("Превышен лимит фото в базе данных");

    const {eqUuid} = req.params;
    const doc = await db.get(eqUuid);

    const filetype = String(req.file.originalname)
      .match(/\.([^\.]+)$/)[1]
      .toLowerCase();
    const filename = `${uuid()}.${filetype}`;
    const filepath = path.resolve(IMAGE_DB_PATH, filename);
    const url = IMAGE_BASE + filename;

    await fs.promises.writeFile(filepath, req.file.buffer);
    doc.images.push({filename});
    await db.put(doc);

    res.json({url});
  })().catch((err) => next(err));
});

router.get("/:uuid", function (req, res, next) {
  const uuid = req.params.uuid;

  res.json({id: uuid, method: "get", message: "not implemented yet"});
});

router.post("/", function (req, res, next) {
  const body = req.body;

  res.json({body, method: "post", message: "not implemented yet"});
});

router.put("/:uuid", function (req, res, next) {
  const uuid = req.params.uuid;
  const body = req.body;

  res.json({id: uuid, body, method: "put", message: "not implemented yet"});
});

router.delete("/:uuid", function (req, res, next) {
  const uuid = req.params.uuid;

  res.json({id: uuid, method: "delete", message: "not implemented yet"});
});

module.exports = router;
