//@ts-check
const mongoose = require("mongoose");
const _ = require("lodash");
const Exercise = mongoose.model("Exercise");
const {isAuthenticated} = require("../../middleware");
const {isTeacher} = require("../../middleware");
const multiparty = require('connect-multiparty')();
/**
 * Exercises Contoller
 * @param {object} router
 */
module.exports = (router) => {
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

            try {

                let exercises = await Exercise.find()
                    .where({ _id: ids, });

                return res.status(200).json(exercises);
                
            } catch (error) {
                console.log(error);
                return res.status(500).send("server error");
            }
        },
    );
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
            
            let exercise = new Exercise({
                _id: new mongoose.Types.ObjectId(),
                name: name,
                description: description,
                branch: branch,
                specialization: specialization,
                typeOfStudy: typeOfStudy,
                semester: semester,
                owner: req.session.user._id,
            });
            
            try {

                await exercise.save();
                return res.status(200).json(exercise);
                
            } catch (error) {
                console.log(error);
                return res.status(500).send("server error");
            }
        },
    );
};