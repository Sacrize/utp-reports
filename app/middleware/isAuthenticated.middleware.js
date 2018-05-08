// @ts-check
/**
 * Redirects when user is not logged
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
function isAuthenticatedMiddleware(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}

module.exports = isAuthenticatedMiddleware;
