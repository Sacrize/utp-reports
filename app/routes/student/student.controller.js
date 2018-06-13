//@ts-check
/** @namespace routes/student */

const mongoose = require("mongoose");
const _ = require("lodash");
const Exercise = mongoose.model("Exercise");
const {
  isAuthenticated,
} = require("../../middleware");
const {
  isStudent,
} = require("../../middleware");

/**
 * Student Route Contoller
 * @param {object} router
 */
module.exports = (router) => {
  /**
   * Generuje drzewko dla studenta, zależnie od tego na jakim jest wydziale, kierunku i semestrze.
   *
   * @name viewStudentWithTree
   * @memberof routes/student
   * @path {GET} /student
   * @code {200} Jeśli wszystko jest ok, zwraca widok
   * @response {Array} branches Lista wydziałów.
   * @response {String} branches[i].name Nazwa wydziału
   * @response {Array} branches[i].specializations Lista kierunków na wydziale UTP
   * @response {String} branches[i].specializations[j].name Nazwa kierunku
   * @response {Array} branches[i].specializations[j].typesOfStudy Lista typów studiów danego kierunku na wydziale UTP
   * @response {String} branches[i].specializations[j].typesOfStudy[k].name Dzienne lub zaoczne
   * @response {Array} branches[i].specializations[j].typesOfStudy[k].semesters Lista semestrów zależnie od typów studiów danego kierunku na wydziale UTP
   * @response {String} branches[i].specializations[j].typesOfStudy[k].semesters[l].name Semestr
   * @response {Array} branches[i].specializations[j].typesOfStudy[k].semesters[l].exercises Lista ćwiczeń
   * @response {View} student/student.vue
   */
  router.get("/student",
    isAuthenticated,
    isStudent,
    /**
     * @param {object} req
     * @param {object} res
     */
    async (req, res) => {

      const data = {};

      let exercises = await Exercise.find()
        .where({
          $or: req.session.user.school.map(s => {
            return {
              branch: s.branch,
              specialization: s.specialization,
              typeOfStudy: s.typeOfStudy,
              semester: s.semester,
            };
          }),
        })
        .exec();

      // drzewko
      let branches = Array();

      exercises.map(exercise => {
        let branch = _.find(branches, o => o.name === exercise.branch);
        if (Boolean(branch) === false) {
          branch = {
            name: exercise.branch,
            specializations: Array(),
          };
          branches.push(branch);
        }
        let specialization = _.find(branch.specializations, o => o.name === exercise.specialization);
        if (Boolean(specialization) === false) {
          specialization = {
            name: exercise.specialization,
            typesOfStudy: Array(),
          };
          branch.specializations.push(specialization);
        }
        let typeOfStudy = _.find(specialization.typesOfStudy, o => o.name === exercise.typeOfStudy);
        if (Boolean(typeOfStudy) === false) {
          typeOfStudy = {
            name: exercise.typeOfStudy,
            semesters: Array(),
          };
          specialization.typesOfStudy.push(typeOfStudy);
        }
        let semester = _.find(typeOfStudy.semesters, o => o.name === exercise.semester);
        if (Boolean(semester) === false) {
          semester = {
            name: exercise.semester,
            exercises: Array(),
          };
          typeOfStudy.semesters.push(semester);
        }
        semester.exercises.push(String(exercise._id));
      });

      data.branches = branches;

      res.renderVue("student/student.vue", data, req.vueOptions);
    },
  );
};
