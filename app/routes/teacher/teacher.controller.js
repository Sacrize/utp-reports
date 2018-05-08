//@ts-check

const mongoose = require("mongoose");
const _ = require("lodash");
const Exercise = mongoose.model("Exercise");
const Class = mongoose.model("Class");
const {isAuthenticated} = require("../../middleware");
const {isTeacher} = require("../../middleware");

/**
 * Teacher Route Contoller
 * @param {object} router
 */
module.exports = (router) => {
    router.get("/teacher",
        isAuthenticated,
        isTeacher,
        /**
         * @param {object} req
         * @param {object} res
         */
        async (req, res) => {

            const data = {};

            let exercises = await Exercise.find()
                .where({ owner: req.session.user._id })
                .exec();

            // drzewko
            data.branches = Array();
            exercises.map(exercise => {
                let branch = _.find(data.branches, o => o.name === exercise.branch);
                if (Boolean(branch) === false) {
                    branch = {
                        name: exercise.branch,
                        specializations: Array(),
                    };
                    data.branches.push(branch);
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
                    };
                    typeOfStudy.semesters.push(semester);
                }
            });

            res.renderVue("teacher/teacher.vue", data, req.vueOptions);
        },
    );
};