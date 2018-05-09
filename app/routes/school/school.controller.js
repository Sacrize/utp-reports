//@ts-check
const mongoose = require("mongoose");
const _ = require("lodash");
const {isAuthenticated} = require("../../middleware");


const classes = [
    { 
        _id: 1,
        branch: "Wydział Telekomunikacji, Informatyki i Elektrotechniki ",
        specialization: "Informatyka stosowana",
        typeOfStudy: "Studia Niestacjonarne Pierwszego Stopnia",
        semester: "Rok 1 Semestr I (zimowy) rok akademicki 2017/2018",
    },
    { 
        _id: 2,
        branch: "Wydział Telekomunikacji, Informatyki i Elektrotechniki ",
        specialization: "Informatyka stosowana",
        typeOfStudy: "Studia Stacjonarne Pierwszego Stopnia",
        semester: "Rok 1 Semestr II (letni) rok akademicki 2017/2018",
    }
];

/**
 * School Contoller
 * @param {object} router
 */
module.exports = (router) => {
    router.get("/school/branches",
        isAuthenticated,
        /**
         * @param {object} req
         * @param {object} res
         */
        async (req, res) => {
            let branches = _.uniqBy(classes, 'branch').map(c => c.branch);
            res.status(200).send(branches);
        },
    );
    router.get("/school/specializations",
        isAuthenticated,
        /**
         * @param {object} req
         * @param {object} res
         */
        async (req, res) => {
            let branch = req.query.branch;
            console.log(branch);
            if (!branch || _.isString(branch) === false) {
                return res.status(400).send("bad request");
            }

            let branches = _.filter(classes, ['branch', branch]);
            let specializations = _.uniqBy(branches, "specialization").map(c => c.specialization);
            res.status(200).send(specializations);
        },
    );
    router.get("/school/typesofstudy",
        isAuthenticated,
        /**
         * @param {object} req
         * @param {object} res
         */
        async (req, res) => {
            let branch = req.query.branch;
            let specialization = req.query.specialization;

            if (!branch || _.isString(branch) === false) {
                return res.status(400).send("bad request");
            }

            if (!specialization || _.isString(specialization) === false) {
                return res.status(400).send("bad request");
            }

            let branches = _.filter(classes, ['branch', branch]);
            let specializations = _.filter(branches, ['specialization', specialization]);
            let typesOfStudy = _.uniqBy(specializations, "typeOfStudy").map(c => c.typeOfStudy);
            res.status(200).send(typesOfStudy);
        },
    );
    router.get("/school/semesters",
        isAuthenticated,
        /**
         * @param {object} req
         * @param {object} res
         */
        async (req, res) => {
            let branch = req.query.branch;
            let specialization = req.query.specialization;
            let typeOfStudy = req.query.typesOfStudy;

            if (!branch || _.isString(branch) === false) {
                return res.status(400).send("bad request");
            }

            if (!specialization || _.isString(specialization) === false) {
                return res.status(400).send("bad request");
            }

            if (!typeOfStudy || _.isString(typeOfStudy) === false) {
                return res.status(400).send("bad request");
            }

            let branches = _.filter(classes, ['branch', branch]);
            let specializations = _.filter(branches, ['specialization', specialization]);
            let typesOfStudy = _.filter(specializations, ['typeOfStudy', typeOfStudy]);
            let semesters = _.uniqBy(typesOfStudy, "semester").map(c => c.semester);
            res.status(200).send(semesters);
        },
    );
};