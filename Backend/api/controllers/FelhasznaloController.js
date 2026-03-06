const db = require("../db");
const { userService } = require("../services")(db);
const { NotFoundError } = require("../errors");

exports.getUser = async (req, res, next) => {
    try {
        res.status(200).json(await userService.getUser());
    } catch (error) {
        next(error);
    }
}

exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        if (!user) throw new NotFoundError("Felhasználó nem található");
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

exports.createUser = async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
        const created = await userService.createUser(req.body, {
            transaction: t,
            lock: t.LOCK.UPDATE,
        });
        await t.commit();
        res.status(201).json(created);
    } catch (error) {
        await t.rollback();
        next(error);
    }
}

exports.updateUser = async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const updated = await userService.updateUser(id, req.body, {
            transaction: t,
        });
        if (!updated) throw new NotFoundError("Felhasználó nem található");
        await t.commit();
        res.status(200).json(updated);
    } catch (error) {
        await t.rollback();
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const deleted = await userService.deleteUser(id, { transaction: t });
        if (!deleted) throw new NotFoundError("Felhasználó nem található");
        await t.commit();
        res.status(200).json({ message: "Felhasználó sikeresen törölve" });
    } catch (error) {
        await t.rollback();
        next(error);
    }
}

exports.getUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.params;
        const user = await userService.getUserByEmail(email);
        if (!user || user.length === 0) throw new NotFoundError("Felhasználó nem található");
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

exports.getUserCountByEmail = async (req, res, next) => {
    try {
        res.status(200).json(await userService.getUserCountByEmail());
    } catch (error) {
        next(error);
    }
}

exports.getTopUsers = async (req, res, next) => {
    try {
        const { limit } = req.query;
        res.status(200).json(await userService.getTopUsers(limit));
    } catch (error) {
        next(error);
    }
}

exports.getUsersByDateRange = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        res.status(200).json(await userService.getUsersByDateRange(startDate, endDate));
    } catch (error) {
        next(error);
    }
}

exports.getUsersByEtkezesType = async (req, res, next) => {
    try {
        res.status(200).json(await userService.getUsersByEtkezesType());
    } catch (error) {
        next(error);
    }
}