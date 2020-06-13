const path = require("path");
const fs = require("fs");

const sharp = require("sharp");

const {uuid, clone} = require("../utils");

const STORAGE_PATHNAME = path.resolve(__dirname, `../../storage/`);
const EQUIPMENT_PATHNAME = path.resolve(STORAGE_PATHNAME, `db/`);
const EQUIPMENT_PATH = path.resolve(EQUIPMENT_PATHNAME, `equipments.json`);
const EQUIPMENT_IMAGES_PATH = path.resolve(EQUIPMENT_PATHNAME, `img/`);

for (const pathname of [
  STORAGE_PATHNAME,
  EQUIPMENT_PATHNAME,
  EQUIPMENT_IMAGES_PATH
]) {
  try {
    fs.mkdirSync(pathname);
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
}

try {
  fs.statSync(EQUIPMENT_PATH);
} catch (err) {
  if (err.code !== "ENOENT") throw err;

  const fakeEquipments = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, `fakeEquipments.json`))
  );

  fs.writeFileSync(EQUIPMENT_PATH, JSON.stringify(fakeEquipments, null, 4));

  const imageFiles = fs.readdirSync(path.resolve(__dirname, `fake-images/`));
  for (imageFile of imageFiles) {
    fs.copyFileSync(
      path.resolve(__dirname, `fake-images/`, imageFile),
      path.resolve(EQUIPMENT_IMAGES_PATH, imageFile)
    );
  }
}

class Db {
  constructor(dbPath) {
    this._dbPath = dbPath;
  }

  allDocs() {
    return new Promise((resolve, reject) => {
      fs.readFile(this._dbPath, `utf-8`, (err, res) => {
        if (err) return reject(err);

        let docs;
        try {
          docs = JSON.parse(res);
        } catch (err) {
          return reject(err);
        }

        return resolve(docs);
      });
    });
  }

  async put(doc) {
    const workingDoc = clone(doc);

    let docs = await this.allDocs();

    if (!workingDoc._id) {
      // новый документ

      workingDoc._id = uuid();
      docs = [...docs, workingDoc];
    } else {
      const dbDoc = this._findById(docs, workingDoc._id);

      if (!dbDoc) {
        // новый документ, id передан клиентом

        docs = [...docs, workingDoc];
      } else {
        // изменение существующего документа

        Object.assign(dbDoc, workingDoc);
      }
    }

    await fs.promises.writeFile(this._dbPath, JSON.stringify(docs, null, 4));

    return workingDoc;
  }

  async get(docId) {
    const docs = await this.allDocs();
    return this._findById(docs, docId);
  }

  async addImage(docId, originalFilename, buffer) {
    const files = await fs.promises.readdir(EQUIPMENT_IMAGES_PATH);

    //FIXME временное ограничение количества фото в базе данных
    if (files.length > 20) throw Error("Превышен лимит фото в базе данных");

    await this._lock();

    const doc = await this.get(docId);

    const filetype = String(originalFilename)
      .match(/\.([^\.]+)$/)[1]
      .toLowerCase();
    const filename = `${uuid()}.${filetype}`;

    const filepath = path.resolve(EQUIPMENT_IMAGES_PATH, filename);

    await fs.promises.writeFile(filepath, buffer);
    const image = {filename};
    doc.images.push(image);
    await this.put(doc);

    await this._unlock();

    return image;
  }

  async deleteImage(docId, filename) {
    await this._lock();

    const doc = await this.get(docId);
    const image = doc.images.find((img) => img.filename === filename);

    if (!image) throw Error(`Файл ${filename} в документе ${docId} не найден.`);

    doc.images = doc.images.filter((img) => img !== image);

    await this.put(doc);

    try {
      imgPath = path.resolve(EQUIPMENT_IMAGES_PATH, filename);
      await fs.promises.unlink(imgPath);
    } catch (err) {}

    await this._unlock();

    return doc;
  }

  _findById(docs, id) {
    const foundDocs = docs.filter((doc) => doc._id === id);
    if (foundDocs.length === 0) return false;

    return foundDocs[0];
  }

  // TODO сделать блокировки, чтобы не было конфликтов при работе нескольких пользователей
  async _lock() {}
  async _unlock() {}
}

const db = new Db(EQUIPMENT_PATH);

module.exports = {db};
