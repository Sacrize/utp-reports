// @ts-check
/**
 * Przekierowuje do widoku logowania, gdy nie jest zalogowany.
 *
 * @memberof middlewares
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @code {301} Jeśli użytkownik nie jest zalogowany. Przenosi do widoku logowania.
 */
function isAuthenticatedMiddleware(req, res, next) {
    if (!req.session.user) {
        return res.status(301).redirect("/login");
    }
    next();
}

module.exports = isAuthenticatedMiddleware;
