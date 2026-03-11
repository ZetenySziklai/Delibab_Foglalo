const jwt = require("jsonwebtoken");

exports.generateUserToken = (user) =>
{
    return jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
}

exports.verifyToken = (token) =>
{
    try
    {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch(error)
    {
        return null;
    }
}

exports.setCookie = (res, cookieName, value) =>
{
    res.cookie(cookieName, value,
    {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    });
}
