const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");

const authUtils = require("../utilities/authUtils");

exports.verifyToken = async (req, res, next) =>
{
    const { user_token } = req.cookies || {};

    if (!user_token) return next(new UnauthorizedError("Be kell jelentkezni a funkció használatához"));

    const user = authUtils.verifyToken(user_token);

    if (!user) return next(new UnauthorizedError("Érvénytelen vagy lejárt token"));

    req.user = user;

    next();
}

exports.verifyAdmin = async (req, res, next) =>
{
    const { user_token } = req.cookies || {};

    if (!user_token) return next(new UnauthorizedError("Be kell jelentkezni a funkció használatához"));

    const user = authUtils.verifyToken(user_token);

    if (!user) return next(new UnauthorizedError("Érvénytelen vagy lejárt token"));

    if (!user.isAdmin) return next(new UnauthorizedError("Nincs jogosultsága ehhez a művelethez"));

    req.user = user;

    next();
}
