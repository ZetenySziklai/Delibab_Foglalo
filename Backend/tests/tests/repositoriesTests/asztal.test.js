const db = require("../../../api/db");
const AsztalRepository = require("../../../api/repositories/AsztalRepository");

const asztalRepository = new AsztalRepository(db);

describe("Repository tests", () => 
{
    describe("AsztalRepository", () => 
    {
        let asztal1, asztal2;

        beforeAll(async () => 
        {
            await db.sequelize.sync({ force: true });
            asztal1 = await db.Asztal.create({ helyek_szama: 4 });
            asztal2 = await db.Asztal.create({ helyek_szama: 6 });
        });

        afterAll(async () => 
        {
            await db.Asztal.destroy({ where: {} });
        });

        test("getAsztal returns correct values from db", async () => 
        {
            const results = await asztalRepository.getAsztal();
            expect(results.length).toBeGreaterThanOrEqual(2);
        });

        test("getAsztalById should return asztal by id", async () => 
        {
            const result = await asztalRepository.getAsztalById(asztal1.id);
            expect(result.id).toBe(asztal1.id);
        });
    });
});
