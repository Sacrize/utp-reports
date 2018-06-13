//@ts-check

/**
 * Auth Contoller
 * @param {object} router
 */
module.exports = (router) => {
  /**
   * Tymczasowo zapisuje do sesji statyczne dane, identyfikując użytkownika jako studenta lub nauczyciela.
   *
   * @name login
   * @memberof routes
   * @path {GET} /login
   * @query {String} role Klasyfikuje użytkownika jako studenta lub nauczyciela.
   * @code {301} Przekieruje do właściwego modułu w przypadku poprawnego zalogowania.
   * @code {400} Zwróci widok logowania jeśli nie uda się zalogować.
   */
  router.get("/login",
    /**
     * @param {object} req
     * @param {object} res
     */
    (req, res) => {
      if (req.query.role === "student") {
        req.session.user = {
          _id: "5ab13f0201182942038b9a74",
          role: "student",
          name: "Jan Kowalski",
          index: "12",
          // e.g the student can study many specializations
          school: [{
              branch: "Wydział Telekomunikacji, Informatyki i Elektrotechniki",
              specialization: "Informatyka stosowana",
              typeOfStudy: "Studia Niestacjonarne Pierwszego Stopnia",
              semester: "Rok 1 Semestr I (zimowy) rok akademicki 2017/2018",
            },
            {
              branch: "Wydział Budownictwa, Architektury i Inżynierii Środowiska",
              specialization: "Informatyka stosowana",
              typeOfStudy: "Studia Stacjonarne Pierwszego Stopnia",
              semester: "Rok 1 Semestr II (letni) rok akademicki 2017/2018",
            },
          ],
        };
        return res.redirect("/student");
      } else if (req.query.role === "teacher") {
        req.session.user = {
          _id: "5ab13f0201182942038b9a75",
          role: "teacher",
        };
        return res.redirect("/teacher");
      }

      res.status(400).renderVue("auth/login.vue", {}, req.vueOptions);
    },
  );
  /**
   * Wylogowanie z konta. Tymczasowo, tylko usuwa dane z sesji.
   *
   * @name logout
   * @memberof routes
   * @path {GET} /logout
   * @code {301} Przekieruje do widoku logowania.
   */
  router.get("/logout",
    /**
     * @param {object} req
     * @param {object} res
     */
    (req, res) => {
      delete req.session.user;
      res.code(301).redirect("/login");
    },
  );
};
