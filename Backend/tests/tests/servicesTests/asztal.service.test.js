const { BadRequestError } = require("../../../api/errors");
const db = require("../../../api/db");
const { asztalService } = require("../../../api/services")(db);

describe("AsztalService tests", () => {
    beforeAll(async () => {
        await db.sequelize.sync();
    });

    const asztalok = [
        { helyek_szama: 2 },
        { helyek_szama: 4 }
    ];

    let createdAsztalok;

    beforeEach(async () => {
        await db.Asztal.destroy({ where: {} });
        createdAsztalok = await db.Asztal.bulkCreate(asztalok);
    });

    test("getAsztal should return all tables", async () => {
        const result = await asztalService.getAsztal();
        expect(result.length).toBeGreaterThanOrEqual(asztalok.length);
    });

    test("getAsztalById should return correct table", async () => {
        const asztal = await asztalService.getAsztalById(createdAsztalok[0].id);
        expect(asztal.helyek_szama).toBe(asztalok[0].helyek_szama);
    });

    test("createAsztal should create a new table", async () => {
        const newAsztal = { helyek_szama: 6 };
        const result = await asztalService.createAsztal(newAsztal);
        expect(result.helyek_szama).toBe(newAsztal.helyek_szama);
    });

    test("createAsztal should throw BadRequestError when helyek_szama is missing", async () => {
        await expect(asztalService.createAsztal({})).rejects.toThrow(BadRequestError);
    });

    test("getSzabadAsztalok should return available tables", async () => {
        const result = await asztalService.getSzabadAsztalok("2026-12-01", "12:00", 2);
        expect(result.length).toBeGreaterThan(0);
    });
});
