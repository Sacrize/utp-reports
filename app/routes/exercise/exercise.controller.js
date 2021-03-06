//@ts-check
/** @namespace routes/exercise */
const mongoose = require("mongoose");
const _ = require("lodash");
const Exercise = mongoose.model("Exercise");
const {
  isAuthenticated,
} = require("../../middleware");
const {
  isTeacher,
} = require("../../middleware");
const multiparty = require("connect-multiparty")();
const Gridfs = require("gridfs-stream");
const config = require("../../config");
const clam = require("clamav.js");
const fs = require("fs");

/**
 * Exercises Contoller
 * @param {object} router
 */
module.exports = (router) => {
  /**
   * Zwraca ćwiczenia dla podanej listy id.
   *
   * @name getExercisesByIds
   * @memberof routes/exercise
   * @path {GET} /exercise
   * @query {Array} ids Lista z id'kami ćwiczeń.
   * @code {200} Zwraca json z ćwiczeniami.
   * @code {400} Jeśli ids nie jest listą.
   * @code {500} Jak coś pójdzie nie tak.
   */
  router.get("/exercise",
    isAuthenticated,
    /**
     * @param {object} req
     * @param {object} res
     */
    async (req, res) => {
      let ids = req.query.ids;

      if (_.isArray(ids) === false) {
        return res.status(400).send("bad request");
      }

      let exercises = await Exercise.find()
        .where({
          _id: ids,
        });

      return res.status(200).json(exercises);
    },
  );
  /**
   * Zwraca ćwiczenia dla podanej listy id.
   *
   * @name getFileByExerciseId
   * @memberof routes/exercise
   * @path {GET} /exercise/file
   * @query {String} exercise Id ćwiczenia, z którego chcemy pobrać plik.
   * @code {200} Jeśli wszystko ok.
   * @code {400} Jeśli id ćwiczenia jest błędne.
   * @code {404} Jeśli nie znajdzie pliku.
   * @code {500} Jak coś pójdzie nie tak.
   */
  router.get("/exercise/file",
    isAuthenticated,
    /**
     * @param {object} req
     * @param {object} res
     */
    async (req, res) => {
      let _id = req.query.exercise;

      if (!_.isString(_id)) {
        return res.status(400).send("bad request");
      }

      let exercise = await Exercise.findOne()
        .where({
          _id: _id,
        });

      if (Boolean(exercise.file) === false) {
        return res.status(404).send("not found");
      }

      const db = mongoose.connection.db;
      const mongoDriver = mongoose.mongo;
      const gfs = new Gridfs(db, mongoDriver);

      gfs.files.find({
        _id: exercise.file,
      }).toArray(function(err, files) {
        if (err) { throw err; }

        let readstream = gfs.createReadStream({
          _id: files[0]._id,
        });

        let extension = /(?:\.([^.]+))?$/.exec(files[0].filename)[1];
        let filename = exercise.file + "." + extension;

        res.setHeader("Content-disposition", "attachment; filename=" + filename);

        readstream.pipe(res);
      });

    },
  );
  /**
   * Interfejs do dodawania ćwiczeń. Antywirus skanuje załącznik.
   *
   * @name insertExercise
   * @memberof routes/exercise
   * @path {POST} /exercise
   * @body {String} name Nazwa.
   * @body {String} description Opis.
   * @body {String} branch Wydział UTP.
   * @body {String} specialization Kierunek studiów.
   * @body {String} typeOfStudy Dzienny czy zaoczny.
   * @body {String} semester Semestr.
   * @body {File} attachment Załącznik. Może to być np. rozszerzony opis ćwiczenia.
   * @response {Object} Exercise Dodane ćwiczenie do bazy danych.
   * @response {String} Exercise._id Id.
   * @response {String} Exercise.name Nazwa.
   * @response {String} Exercise.description Opis.
   * @response {String} Exercise.branch Wydział UTP.
   * @response {String} Exercise.specialization Kierunek studiów.
   * @response {String} Exercise.typeOfStudy Dzienne czy zaoczne.
   * @response {String} Exercise.semester Semestr.
   * @response {String} Exercise.owner Id nauczyciela, do którego należy ćwiczenie.
   * @response {String} Exercise.file Id pliku zapisanego w gridfs.
   * @code {200} Jeśli doda ćwiczenie do bazy danych.
   * @code {500} Jak coś pójdzie nie tak lub plik będzie zawirusowany.
   */
  router.post("/exercise",
    isAuthenticated,
    isTeacher,
    multiparty,
    /**
     * @param {object} req
     * @param {object} res
     */
    async (req, res) => {
      let name = req.body.name;
      let description = req.body.description;
      let branch = req.body.branch;
      let specialization = req.body.specialization;
      let typeOfStudy = req.body.typeOfStudy;
      let semester = req.body.semester;

      const db = mongoose.connection.db;
      const mongoDriver = mongoose.mongo;
      const gfs = new Gridfs(db, mongoDriver);

      let file = undefined;
      if (req.files && req.files.attachment) {
        file = await new Promise((resolve, reject) => {
          clam.createScanner(3310, "clamav").scan(req.files.attachment.path, (err, object, malicious) => {
            if (err) { return reject(err); }

            if (malicious) {
              return reject(new Error("Abort. File is infected."));
            }

            const writestream = gfs.createWriteStream({
              filename: req.files.attachment.name,
              content_type: req.files.attachment.mimetype,
              mode: "w",
            });

            fs.createReadStream(req.files.attachment.path).pipe(writestream);

            writestream.on("close", (file) => {
              fs.unlinkSync(req.files.attachment.path);
              return resolve(file);
            });
          });
        });
      }

      let exercise = new Exercise({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        description: description,
        branch: branch,
        specialization: specialization,
        typeOfStudy: typeOfStudy,
        semester: semester,
        owner: req.session.user._id,
        file: file ? file._id : null,
      });

      try {

        await exercise.save();
        return res.status(200).json(exercise);

      } catch (error) {
        console.log(error);
        if (file) {
          gfs.remove({
            _id: file._id,
          }, (err, gridStore) => {
            if (err) { return console.log(err); }
            console.debug("Removed file from database after insert error.");
          });
        }
        return res.status(500).send("server error");
      }
    },
  );
};
