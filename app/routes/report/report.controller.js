//@ts-check
/** @namespace routes/reports */

const mongoose = require("mongoose");
const _ = require("lodash");
const Report = mongoose.model("Report");
const {
  isAuthenticated,
} = require("../../middleware");
const {
  isStudent,
} = require("../../middleware");
const {
  isTeacher,
} = require("../../middleware");
const multiparty = require("connect-multiparty")();
/**
 * Reports Contoller
 * @param {object} router
 */
module.exports = (router) => {
  /**
   * Zwraca sprawozdania.
   * @name getReportsByExercise
   * @memberof routes/exercise
   * @path {GET} /report
   * @query {String} exercise ćwiczenie z którego chcemy sprawozdania.
   * @code {200} Zwraca json z sprawozdaniami.
   * @code {400} Jeśli cwiczenie nie jest String.
   * @code {500} Jak coś pójdzie nie tak.
   */
  router.get("/report",
    isAuthenticated,
    isTeacher,
    /**
     * @param {object} req
     * @param {object} res
     */
    async (req, res) => {
      let exercise = req.query.exercise;

      if (_.isString(exercise) === false) {
        return res.status(400).send("bad request");
      }

      try {

        let reports = await Report.find()
          .where({
            exercise: exercise,
          })
          .sort({
            createdAt: "desc",
          });

        reports = _.uniqBy(reports, "studentIndex");
        return res.status(200).json(reports);

      } catch (error) {
        console.log(error);
        return res.status(500).send("server error");
      }
    },
  );
  /**
   * Zwraca historie sprawozdania.
   *
   * @name getHistoryByReportExercise
   * @memberof routes/report
   * @path {GET} /report/history
   * @query {String} exercise ćwiczenie z którego chcemy historie.
   * @code {200} Jesli wszystko jest ok.
   * @code {400} Jeśli nie jest String.
   * @code {500} Jeśli coś pójdzie nie tak.
   */
  router.get("/report/history",
    isAuthenticated,
    isStudent,
    /**
     * @param {object} req
     * @param {object} res
     */
    async (req, res) => {
      let exercise = req.query.exercise;

      if (_.isString(exercise) === false) {
        return res.status(400).send("bad request");
      }

      try {

        let reports = await Report.find()
          .where({
            exercise: exercise,
          })
          .sort({
            createdAt: "desc",
          });

        return res.status(200).json(reports);

      } catch (error) {
        console.log(error);
        return res.status(500).send("server error");
      }
    },
  );
  /**
   * Dodawanie sprawozdania.
   * 
   * @name insertReport
   * @memberof routes/report
   * @path {POST} /report
   * @body {String} exercise Ćwiczenie.
   * @response {Object} Report Dodano sprawozdanie do bazy
   * response {String} Report._id Id.
   * response {String} Report.studentName Imie studenta.
   * response {String} Report.studentIndex Id studenta.
   * response {String} Report.exercise Nazwa cwiczenia
   * @code {200} Jeśli doda sprawozdanie do bazy.
   * @code {500} Jeśli coś pójdzie nie tak.
   */
  router.post("/report",
    isAuthenticated,
    isStudent,
    multiparty,
    /**
     * @param {object} req
     * @param {object} res
     */
    async (req, res) => {
      let exercise = req.body.exercise;

      let report = new Report({
        _id: new mongoose.Types.ObjectId(),
        studentName: req.session.user.name,
        studentIndex: req.session.user.index,
        exercise: exercise,
      });

      try {

        await report.save();

        // przedawnianie pozostalych sprawozdań
        await Report.update({
          _id: {
            $ne: report._id,
          },
          studentIndex: report.studentIndex,
          exercise: report.exercise,
        }, {
          $set: {
            status: "deprecated",
          },
        }, {
          multi: true,
        });

        return res.status(200).json(report);

      } catch (error) {
        console.log(error);
        return res.status(500).send("server error");
      }
    },
  );

  /**
   * Przypisanie statusu sprawozdania, z powodem jeśli odrzucone.
   * 
   * @name setReportStatus
   * @memberof routes/report
   * @path {PATCH} /reports/:id
   * @body {String} status Status sprawozdania
   * @body {String} reason Powod odrzucenia sprawozdania, jeśli jest odrzucone.
   * @code {200} Jeśli wszystko ok.
   * @code {400} Jeśli id sprawozdania jest błędne
   * @code {500} Jak coś pójdzie nie tak.
   */
  router.patch("/reports/:id",
    isAuthenticated,
    isTeacher,
    /**
     * @param {object} req
     * @param {object} res
     */
    async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const reason = req.body.reason;

      let report = await Report.findOne()
        .where({
          _id: id,
        });

      if (!report) {
        return res.status(400).send("bad request");
      }

      try {

        await Report.update({
          _id: id,
        }, {
          $set: Object.assign({}, {
              status: status,
            },
            status === "rejected" ? {
              reason: reason,
            } : {},
          ),
        });

        return res.status(200).send("ok");

      } catch (error) {
        console.log(error);
        return res.status(500).send("server error");
      }
    },
  );
};
