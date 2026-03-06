const db = require("../db");
const { asztalService } = require("../services")(db);
const { NotFoundError } = require("../errors");

exports.getAsztal = async (req, res, next) => {
    try {
        res.status(200).json(await asztalService.getAsztal());
    } catch (error) {
        next(error);
    }
}

exports.getAsztalById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const asztal = await asztalService.getAsztalById(id);
        if (!asztal) throw new NotFoundError("Asztal nem található");
        res.status(200).json(asztal);
    } catch (error) {
        next(error);
    }
}

exports.createAsztal = async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
        const created = await asztalService.createAsztal(req.body, { transaction: t });
        await t.commit();
        res.status(201).json(created);
    } catch (error) {
        await t.rollback();
        next(error);
    }
}

exports.updateAsztal = async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const updated = await asztalService.updateAsztal(id, req.body, { transaction: t });
        if (!updated) throw new NotFoundError("Asztal nem található");
        await t.commit();
        res.status(200).json(updated);
    } catch (error) {
        await t.rollback();
        next(error);
    }
}

exports.deleteAsztal = async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const deleted = await asztalService.deleteAsztal(id, { transaction: t });
        if (!deleted) throw new NotFoundError("Asztal nem található");
        await t.commit();
        res.status(200).json({ message: "Asztal sikeresen törölve" });
    } catch (error) {
        await t.rollback();
        next(error);
    }
}

exports.getSzabadAsztalok = async (req, res, next) => {
    try {
        const { datum, idopont, helyekSzama } = req.query;
        const szabadAsztalok = await asztalService.getSzabadAsztalok(datum, idopont, helyekSzama);
        res.status(200).json({
            datum,
            idopont,
            helyek_szama: helyekSzama || "nincs megadva",
            szabad_asztalok: szabadAsztalok
        });
    } catch (error) {
        next(error);
    }
}