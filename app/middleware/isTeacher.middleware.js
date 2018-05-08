// @ts-check
/**
 * Redirects when user is not logged
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
function isTeacherMiddleware(req, res, next) {
    if (req.session.user.role !== "teacher") {
        return res.status(403).send("forbidden");
    }
    next();
}

module.exports = isTeacherMiddleware;
