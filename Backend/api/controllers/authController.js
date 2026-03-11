const bcrypt = require("bcrypt");
const db = require("../db");
const { userService } = require("../services")(db);
const authUtils = require("../utilities/authUtils");
const { BadRequestError, UnauthorizedError } = require("../errors");

exports.login = async (req, res, next) =>
{
    const { email, jelszo } = req.body;

    try
    {
        if (!email || !jelszo)
        {
            throw new BadRequestError("Email és jelszó megadása kötelező");
        }

        const users = await userService.getUserByEmail(email);

        if (!users || users.length === 0)
        {
            throw new UnauthorizedError("Hibás email vagy jelszó");
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(jelszo, user.jelszo);

        if (!passwordMatch)
        {
            throw new UnauthorizedError("Hibás email vagy jelszó");
        }

        const token = authUtils.generateUserToken(user);

        authUtils.setCookie(res, "user_token", token);

        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                vezeteknev: user.vezeteknev,
                keresztnev: user.keresztnev,
                telefonszam: user.telefonszam
            }
        });
    }
    catch(error)
    {
        next(error);
    }
}

exports.status = (req, res, next) =>
{
    const token = req.cookies?.user_token;

    if (!token) return res.sendStatus(401);

    if (authUtils.verifyToken(token)) return res.sendStatus(200);

    res.sendStatus(401);
}

exports.logout = (req, res, next) =>
{
    res.clearCookie("user_token");
    res.sendStatus(200);
}
