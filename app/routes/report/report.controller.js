//@ts-check
const mongoose = require("mongoose");
const _ = require("lodash");
const Report = mongoose.model("Report");
const {isAuthenticated} = require("../../middleware");
const {isStudent} = require("../../middleware");
const {isTeacher} = require("../../middleware");
const multiparty = require('connect-multiparty')();
/**
 * Reports Contoller
 * @param {object} router
 */
module.exports = (router) => {
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
                    .where({ exercise: exercise, })
                    .sort({createdAt: "desc"});

                reports = _.uniqBy(reports, "studentIndex");
                return res.status(200).json(reports);
                
            } catch (error) {
                console.log(error);
                return res.status(500).send("server error");
            }
        },
    );
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
                    .where({ exercise: exercise, })
                    .sort({createdAt: 'desc'});

                return res.status(200).json(reports);
                
            } catch (error) {
                console.log(error);
                return res.status(500).send("server error");
            }
        },
    );
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
                    _id: { $ne: report._id, },
                    studentIndex: report.studentIndex,
                    exercise: report.exercise,
                }, {
                    $set: { status: 'deprecated' }
                }, { 
                    multi: true 
                });

                return res.status(200).json(report);
                
            } catch (error) {
                console.log(error);
                return res.status(500).send("server error");
            }
        },
    );
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
                .where({ _id: id, });

            if (!report) {
                return res.status(400).send("bad request");
            }

            try {

                await Report.update({
                    _id: id,
                }, {
                    $set: Object.assign({}, 
                        { status: status, }, 
                        status === 'rejected' ? {
                            reason: reason,
                        } : {}
                    ),
                });

                return res.status(200).send("ok");

            } catch (error) {
                console.log(error);
                return res.status(500).send("server error");
            }
        }
    );
};