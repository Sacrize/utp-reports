// @ts-check
/**
 * Prevent Access When Not A Student
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
function isStudentMiddleware(req, res, next) {
    if (req.session.user.role !== "student") {
        return res.status(403).send("forbidden");
    }
    next();
}

module.exports = isStudentMiddleware;
