//@ts-check

/**
 * Main Route Contoller
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
                };
                return res.redirect("/student");
            } else if (req.query.role === "teacher") {
                req.session.user = {
                    _id: "5ab13f0201182942038b9a75",
                    role: "teacher",
                };
                return res.redirect("/teacher");
            }

            res.renderVue("login/login.vue", {}, req.vueOptions);
        },
    );
};