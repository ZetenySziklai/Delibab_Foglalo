const { BadRequestError } = require("../../../api/errors");
const db = require("../../../api/db");
const { foglalasService } = require("../../../api/services")(db);

describe("FoglalasService tests", () => {
    beforeAll(async () => {
        await db.sequelize.sync();
    });

    let user, asztal;

    beforeEach(async () => {
        await db.Foglalas.destroy({ where: {} });
        await db.Felhasznalo.destroy({ where: {} });
        await db.Asztal.destroy({ where: {} });

        user = await db.Felhasznalo.create({
            vezeteknev: "Teszt",
            keresztnev: "Elek",
            email: "teszt.elek@example.com",
            telefonszam: "0611111111",
            jelszo: "password123"
        });

        asztal = await db.Asztal.create({ helyek_szama: 4 });
    });

    test("createFoglalas should create a new booking", async () => {
        const foglalas = {
            user_id: user.id,
            asztal_id: asztal.id,
            foglalas_datum: "2026-12-01 18:00:00"
        };
        const result = await foglalasService.createFoglalas(foglalas);
        expect(result.user_id).toBe(user.id);
        expect(result.asztal_id).toBe(asztal.id);
    });

    test("createFoglalas should throw BadRequestError when user_id is missing", async () => {
        await expect(foglalasService.createFoglalas({})).rejects.toThrow(BadRequestError);
    });

    test("getFoglaltIdopontok should return booked times", async () => {
        const result = await foglalasService.getFoglaltIdopontok("2026-12-01", asztal.id);
        expect(Array.isArray(result)).toBe(true);
    });
});
