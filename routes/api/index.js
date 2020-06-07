const express = require("express");
const router = express.Router();

const {db} = require("../../lib/db");

router.get("/", function (req, res, next) {
  (async () => {
    res.json(await db.allDocs());
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
