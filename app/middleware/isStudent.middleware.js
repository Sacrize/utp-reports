// @ts-check
/**
 * Odmawia dostępu jeśli użytkownik nie jest studentem.
 *
 * @memberof middlewares
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @code {403} Jeśli użytkownik nie jest studentem.
 */
function isStudentMiddleware(req, res, next) {
    if (req.session.user.role !== "student") {
        return res.status(403).send("forbidden");
    }
    next();
}

module.exports = isStudentMiddleware;
