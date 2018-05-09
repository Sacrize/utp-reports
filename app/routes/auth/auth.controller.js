//@ts-check

/**
 * Auth Contoller
 * @param {object} router
 */
module.exports = (router) => {
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
                    // e.g the student can study many specializations
                    school: [
                        { 
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
                        }
                    ]
                };
                return res.redirect("/student");
            } else if (req.query.role === "teacher") {
                req.session.user = {
                    _id: "5ab13f0201182942038b9a75",
                    role: "teacher",
                };
                return res.redirect("/teacher");
            }

            res.renderVue("auth/login.vue", {}, req.vueOptions);
        },
    );
    router.get("/logout",
        /**
         * @param {object} req
         * @param {object} res
         */
        (req, res) => {
            delete req.session.user;
            res.redirect("/login");
        }
    );
};