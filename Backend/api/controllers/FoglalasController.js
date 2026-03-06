const db = require("../db");
const { foglalasService } = require("../services")(db);
const { NotFoundError } = require("../errors");

exports.getFoglalas = async (req, res, next) => {
    try {
        res.status(200).json(await foglalasService.getFoglalas());
    } catch (error) {
        next(error);
    }
}

exports.getFoglalasById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const foglalas = await foglalasService.getFoglalasById(id);
        if (!foglalas) throw new NotFoundError("Foglalás nem található");
        res.status(200).json(foglalas);
    } catch (error) {
        next(error);
    }
}

exports.createFoglalas = async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
        const created = await foglalasService.createFoglalas(req.body, {
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

exports.updateFoglalas = async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const updated = await foglalasService.updateFoglalas(id, req.body, { transaction: t });
        if (!updated) throw new NotFoundError("Foglalás nem található");
        await t.commit();
        res.status(200).json(updated);
    } catch (error) {
        await t.rollback();
        next(error);
    }
}

exports.deleteFoglalas = async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const deleted = await foglalasService.deleteFoglalas(id, { transaction: t });
        if (!deleted) throw new NotFoundError("Foglalás nem található");
        await t.commit();
        res.status(200).json({ message: "Foglalás sikeresen törölve" });
    } catch (error) {
        await t.rollback();
        next(error);
    }
}

exports.getFoglaltIdopontok = async (req, res, next) => {
    try {
        const { datum, asztalId } = req.query;
        const foglaltIdopontok = await foglalasService.getFoglaltIdopontok(datum, asztalId);
        res.status(200).json({
            datum,
            asztal_id: asztalId,
            foglalt_idopontok: foglaltIdopontok
        });
    } catch (error) {
        next(error);
    }
}

exports.getFoglalasByDatum = async (req, res, next) => {
    try {
        const { datum } = req.query;
        res.status(200).json(await foglalasService.getFoglalasByDatum(datum));
    } catch (error) {
        next(error);
    }
}

exports.getFoglalasByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        res.status(200).json(await foglalasService.getFoglalasByUser(userId));
    } catch (error) {
        next(error);
    }
}