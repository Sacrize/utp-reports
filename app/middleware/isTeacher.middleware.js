// @ts-check
/**
 * Odmawia dostępu jeśli użytkownik nie jest nauczycielem.
 *
 * @memberof middlewares
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @code {403} Jeśli użytkownik nie jest nauczycielem.
 */
function isTeacherMiddleware(req, res, next) {
    if (req.session.user.role !== "teacher") {
        return res.status(403).send("forbidden");
    }
    next();
}

module.exports = isTeacherMiddleware;
