const path = require("path");
const fs = require("fs");

const sharp = require("sharp");

const {uuid, clone} = require("../utils");

const STORAGE_PATHNAME = path.resolve(`storage/`);
const DB_PATHNAME = path.resolve(STORAGE_PATHNAME, `db/`);
const LOCKPATH = path.resolve(DB_PATHNAME, "LOCK");

const IMAGE_WIDTH = 640;

class Db {
  constructor(dbPathName) {
    this._pathname = dbPathName;

    this._path = path.resolve(this._pathname, `equipments.json`);
    this._imagesPathname = path.resolve(this._pathname, `img/`);
    this._imagesOriginalPathname = path.resolve(
      this._imagesPathname,
      `original/`
    );
  }

  init() {
    for (const pathname of [
      this._pathname,
      this._imagesPathname,
      this._imagesOriginalPathname
    ]) {
      try {
        fs.mkdirSync(pathname, {recursive: true});
      } catch (err) {
        if (err.code !== "EEXIST") throw err;
      }
    }

    try {
      fs.statSync(this._path);
    } catch (err) {
      if (err.code !== "ENOENT") throw err;

      const fakeEquipments = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, `fakeEquipments.json`))
      );

      fs.writeFileSync(this._path, JSON.stringify(fakeEquipments, null, 4));

      const imageFiles = fs.readdirSync(
        path.resolve(__dirname, `fake-images/`)
      );
      for (const imageFile of imageFiles) {
        fs.copyFileSync(
          path.resolve(__dirname, `fake-images/`, imageFile),
          path.resolve(this._imagesOriginalPathname, imageFile)
        );

        (async () => {
          await sharp(path.resolve(__dirname, `fake-images/`, imageFile))
            .resize(IMAGE_WIDTH)
            .toFile(path.resolve(this._imagesPathname, imageFile));
        })().catch((err) => {
          console.error(err);
          process.exit(1);
        });
      }
    }
  }

  allDocs() {
    return new Promise((resolve, reject) => {
      fs.readFile(this._path, `utf-8`, (err, res) => {
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
    await this._lock();

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

    await fs.promises.writeFile(this._path, JSON.stringify(docs, null, 4));

    await this._unlock();

    return workingDoc;
  }

  async get(docId) {
    const docs = await this.allDocs();
    return this._findById(docs, docId);
  }

  async addImage(docId, originalFilename, buffer) {
    const files = await fs.promises.readdir(this._imagesPathname);

    //FIXME временное ограничение количества фото в базе данных
    if (files.length > 20) throw Error("Превышен лимит фото в базе данных");

    const doc = await this.get(docId);

    const filetype = String(originalFilename)
      .match(/\.([^\.]+)$/)[1]
      .toLowerCase();
    const filename = `${uuid()}.${filetype}`;

    const filepath = path.resolve(this._imagesPathname, filename);
    const originalFilepath = path.resolve(
      this._imagesOriginalPathname,
      filename
    );

    await fs.promises.writeFile(originalFilepath, buffer);

    await sharp(buffer).resize(IMAGE_WIDTH).toFile(filepath);

    const image = {filename};
    doc.images.push(image);
    await this.put(doc);

    return image;
  }

  async deleteImage(docId, filename) {
    const doc = await this.get(docId);
    const image = doc.images.find((img) => img.filename === filename);

    if (!image) throw Error(`Файл ${filename} в документе ${docId} не найден.`);

    doc.images = doc.images.filter((img) => img !== image);

    await this.put(doc);

    try {
      const imgPath = path.resolve(this._imagesPathname, filename);
      const originalImagePath = path.resolve(
        this._imagesOriginalPathname,
        filename
      );
      await fs.promises.unlink(imgPath);
      await fs.promises.unlink(originalImagePath);
    } catch (err) {
      console.error(err);
    }

    return doc;
  }

  _findById(docs, id) {
    const foundDocs = docs.filter((doc) => doc._id === id);
    if (foundDocs.length === 0) return false;

    return foundDocs[0];
  }

  async _lock() {
    async function checkLock() {
      let canLock = false;

      try {
        // Check if the file exists in the current directory.
        await fs.promises.access(LOCKPATH, fs.constants.F_OK);
      } catch (err) {
        if (err.code !== "ENOENT") {
          throw err;
        }

        canLock = true;
      }

      return canLock;
    }

    let canLock = await checkLock();
    let startTime = new Date();
    const maxWait = 5 * 1000;

    //TODO вместо попыток установить блокировку в цикле сделать очередь операций с базой данных
    while (!canLock) {
      const sleepTime = 300 + Math.random() * 200;
      await new Promise((resolve, reject) => {
        setTimeout(() => resolve(), sleepTime);
      });

      const checkTime = new Date();
      if (checkTime - startTime > maxWait)
        throw Error("База данных. Превышен лимит времени ожидания блокировки");

      canLock = await checkLock();
    }

    await fs.promises.writeFile(LOCKPATH, "");
  }
  async _unlock() {
    await fs.promises.unlink(LOCKPATH);
  }
}

const db = new Db(DB_PATHNAME);
db.init();

module.exports = {db};
