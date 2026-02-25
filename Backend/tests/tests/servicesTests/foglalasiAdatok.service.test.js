const { BadRequestError } = require("../../../api/errors");
const db = require("../../../api/db");
const { foglalasiAdatokService } = require("../../../api/services")(db);

describe("FoglalasiAdatokService tests", () => {
    beforeAll(async () => {
        await db.sequelize.sync();
    });

    beforeEach(async () => {
        await db.FoglalasiAdatok.destroy({ where: {} });
    });

    test("createFoglalasiAdatok should create booking details", async () => {
        const adatok = {
            foglalas_datum: "2025-12-01",
            felnott: 2,
            gyerek: 1
        };
        const result = await foglalasiAdatokService.createFoglalasiAdatok(adatok);
        expect(result.felnott).toBe(adatok.felnott);
    });

    test("createFoglalasiAdatok should throw BadRequestError for negative guests", async () => {
        const invalidAdatok = {
            foglalas_datum: "2025-12-01",
            felnott: -1,
            gyerek: 0
        };
        await expect(foglalasiAdatokService.createFoglalasiAdatok(invalidAdatok)).rejects.toThrow(BadRequestError);
    });
});
