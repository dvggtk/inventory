const express = require("express");
const router = express.Router();

//TODO check https://www.npmjs.com/package/express-fileupload
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage, limits: {fileSize: 10 * 1024 * 1024}});

const {db} = require("../../../lib/db");

const IMAGE_BASE = "/equipments/img/";
const IMAGE_ORIGINAL_BASE = "/equipments/img/original/";

router.get("/", function (req, res, next) {
  (async () => {
    const docs = await db.allDocs();

    for (const doc of docs) {
      doc.images = doc.images.map((image) => {
        const url = IMAGE_BASE + image.filename;
        const urlOriginal = IMAGE_ORIGINAL_BASE + image.filename;
        return {url, urlOriginal};
      });
    }

    res.json(docs);
  })().catch((err) => next(err));
});

// Удалить фото
router.delete("/:eqUuid/images/:filename", function (req, res, next) {
  const {eqUuid, filename} = req.params;

  (async () => {
    const doc = await db.deleteImage(eqUuid, filename);
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
    const {eqUuid} = req.params;
    const originalFilename = req.file.originalname;

    const buffer = req.file.buffer;

    const image = await db.addImage(eqUuid, originalFilename, buffer);
    const url = IMAGE_BASE + image.filename;

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
