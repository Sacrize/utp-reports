//@ts-check
const mongoose = require("mongoose");
const _ = require("lodash");
const {
  isAuthenticated,
} = require("../../middleware");

const classes = [{
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
  },
];

/**
 * School Contoller
 * @param {object} router
 */
module.exports = (router) => {
  /**
   * Zwraca listę wszystkich wydziałów UTP. Na razie ze statycznej listy.
   *
   * @name getSchoolBranches
   * @memberof routes
   * @path {GET} /school/branches
   * @code {200} Jeśli wszystko jest ok.
   * @response {Array} branches Lista wydziałów z unikatowymi elementami (string).
   */
  router.get("/school/branches",
    isAuthenticated,
    /**
     * @param {object} req
     * @param {object} res
     */
    async (req, res) => {
      let branches = _.uniqBy(classes, "branch").map(c => c.branch);
      res.status(200).send(branches);
    },
  );
  /**
   * Zwraca listę wszystkich kierunków na wydziale UTP.
   *
   * @name getSchoolSpecializations
   * @memberof routes
   * @path {GET} /school/specializations
   * @query {String} branch Wydział UTP.
   * @code {200} Jeśli wszystko jest ok.
   * @code {400} Jeśli podany wydział jest błędny.
   * @response {Array} branches Lista kierunków z unikatowymi elementami (string).
   */
  router.get("/school/specializations",
    isAuthenticated,
    /**
     * @param {object} req
     * @param {object} res
     */
    async (req, res) => {
      let branch = req.query.branch;

      if (!branch || _.isString(branch) === false) {
        return res.status(400).send("bad request");
      }

      let branches = _.filter(classes, ["branch", branch]);
      let specializations = _.uniqBy(branches, "specialization").map(c => c.specialization);
      res.status(200).send(specializations);
    },
  );
  /**
   * Zwraca listę wszystkich typów studiów danego kierunku na wydziale UTP.
   *
   * @name getSchoolTypeOfStudy
   * @memberof routes
   * @path {GET} /school/typesofstudy
   * @query {String} branch Wydział UTP.
   * @query {String} specialization Kierunek na wydziale UTP.
   * @code {200} Jeśli wszystko jest ok.
   * @code {400} Jeśli podany wydział lub kierunek jest błędny.
   * @response {Array} typesOfStudy Lista typów z unikatowymi elementami (string).
   */
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

      let branches = _.filter(classes, ["branch", branch]);
      let specializations = _.filter(branches, ["specialization", specialization]);
      let typesOfStudy = _.uniqBy(specializations, "typeOfStudy").map(c => c.typeOfStudy);
      res.status(200).send(typesOfStudy);
    },
  );
  /**
   * Zwraca listę wszystkich semestrów zależnie od typów studiów danego kierunku na wydziale UTP.
   *
   * @name getSchoolTypeOfStudy
   * @memberof routes
   * @path {GET} /school/semesters
   * @query {String} branch Wydział UTP.
   * @query {String} specialization Kierunek na wydziale UTP.
   * @query {String} typeOfStudy Typ studiów danego kieruneku na wydziale UTP.
   * @code {200} Jeśli wszystko jest ok.
   * @code {400} Jeśli podany wydział lub kierunek jest błędny.
   * @response {Array} semesters Lista semestrów z unikatowymi elementami (string).
   */
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

      let branches = _.filter(classes, ["branch", branch]);
      let specializations = _.filter(branches, ["specialization", specialization]);
      let typesOfStudy = _.filter(specializations, ["typeOfStudy", typeOfStudy]);
      let semesters = _.uniqBy(typesOfStudy, "semester").map(c => c.semester);
      res.status(200).send(semesters);
    },
  );
};
