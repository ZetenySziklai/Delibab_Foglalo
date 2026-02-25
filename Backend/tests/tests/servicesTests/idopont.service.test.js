const { BadRequestError } = require("../../../api/errors");
const db = require("../../../api/db");
const { idopontService } = require("../../../api/services")(db);

describe("IdopontService tests", () => {
    beforeAll(async () => {
        await db.sequelize.sync();
    });

    beforeEach(async () => {
        await db.Idopont.destroy({ where: {} });
    });

    test("createIdopont should create a new time slot", async () => {
        const idopont = { kezdet: 10, veg: 12 };
        const result = await idopontService.createIdopont(idopont);
        expect(result.kezdet).toBe(idopont.kezdet);
    });

    test("createIdopont should throw BadRequestError when kezdet >= veg", async () => {
        const invalidIdopont = { kezdet: 14, veg: 10 };
        await expect(idopontService.createIdopont(invalidIdopont)).rejects.toThrow(BadRequestError);
    });
});
