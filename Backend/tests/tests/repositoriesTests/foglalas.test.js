const db = require("../../../api/db");
const FoglalasRepository = require("../../../api/repositories/FoglalasRepository");

const foglalasRepository = new FoglalasRepository(db);

describe("Repository tests", () => 
{
    describe("FoglalasRepository", () => 
    {
        let user1, asztal1;

        beforeAll(async () => 
        {
            await db.sequelize.sync({ force: true });

            user1 = await db.Felhasznalo.create({ 
                vezeteknev: "Kovács",
                keresztnev: "János",
                email: "kovacs.janos@example.com",
                telefonszam: "0612345678",
                jelszo: "pass"
            });

            asztal1 = await db.Asztal.create({ helyek_szama: 4 });

            await db.Foglalas.create({ 
                user_id: user1.id, 
                asztal_id: asztal1.id, 
                foglalas_datum: "2024-01-15 12:00:00"
            });
        });

        afterAll(async () => 
        {
            await db.Foglalas.destroy({ where: {} });
            await db.Asztal.destroy({ where: {} });
            await db.Felhasznalo.destroy({ where: {} });
        });

        test("getFoglalas returns correct values from db", async () => 
        {
            const results = await foglalasRepository.getFoglalas();
            expect(results.length).toBeGreaterThanOrEqual(1);
        });
    });
});
