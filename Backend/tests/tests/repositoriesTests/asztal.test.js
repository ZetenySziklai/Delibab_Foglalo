const { Sequelize } = require("sequelize");
const db = require("../api/db");
const { DbError } = require("../api/errors");

const AsztalRepository = require("../api/repositories/AsztalRepository");

const asztalRepository = new AsztalRepository(db);

describe("Repository tests", () => 
{
    describe("AsztalRepository", () => 
    {
        let asztalAllapot1, asztalAllapot2;

        beforeAll(async () => 
        {
            await db.sequelize.sync({ force: true });

            // Először létrehozunk asztal állapotokat
            asztalAllapot1 = await db.AsztalAllapot.create({ nev: "Szabad" });
            asztalAllapot2 = await db.AsztalAllapot.create({ nev: "Foglalt" });

            // Létrehozunk asztalokat
            await db.Asztal.bulkCreate([
                { 
                    id: 1,
                    helyek_szama: 4,
                    asztal_allapot_id: asztalAllapot1.id
                },
                { 
                    id: 2,
                    helyek_szama: 6,
                    asztal_allapot_id: asztalAllapot1.id
                },
                { 
                    id: 3,
                    helyek_szama: 2,
                    asztal_allapot_id: asztalAllapot2.id
                },
            ]);
        });

        afterAll(async () => 
        {
            await db.Asztal.destroy({ where: {} });
            await db.AsztalAllapot.destroy({ where: {} });
        });

        describe("getAsztal method tests", () => 
        {
            test("getAsztal returns correct values from db", async () => 
            {
                const results = await asztalRepository.getAsztal();

                expect(results.length).toBeGreaterThanOrEqual(3);
            });

            test("the first asztal helyek_szama must be 4", () => 
            {
                const promise = asztalRepository.getAsztal();
                
                return promise.then(results => {
                    const firstAsztal = results.find(a => a.id === 1);
                    expect(firstAsztal).toBeDefined();
                    expect(firstAsztal.helyek_szama).toEqual(4);
                });
            });

            test("should throw error given the database is not setup correctly", async () => 
            {
                const invalidRepository = new AsztalRepository({});

                const promise = invalidRepository.getAsztal();

                await expect(promise).rejects.toThrow();
            });
        });

        describe("getAsztalById method tests", () => 
        {
            test("should return asztal by id", async () => 
            {
                const result = await asztalRepository.getAsztalById(1);

                expect(result).toBeDefined();
                expect(result.id).toBe(1);
                expect(result.helyek_szama).toBe(4);
            });

            test("should return null when id not found", async () => 
            {
                const result = await asztalRepository.getAsztalById(999);

                expect(result).toBeNull();
            });
        });

        describe("createAsztal method tests", () => 
        {
            test("should create an asztal in the database", async () => 
            {
                const asztal = { 
                    helyek_szama: 8,
                    asztal_allapot_id: asztalAllapot1.id
                };

                await asztalRepository.createAsztal(asztal);

                const asztalok = await asztalRepository.getAsztal();

                const foundAsztal = asztalok.find(item => item.helyek_szama === 8);

                expect(foundAsztal).toBeDefined();
                expect(foundAsztal.helyek_szama).toEqual(8);
            });
        });

        describe("updateAsztal method tests", () => 
        {
            test("should update an asztal in the database", async () => 
            {
                const updateData = {
                    helyek_szama: 5
                };

                await asztalRepository.updateAsztal(2, updateData);

                const updated = await asztalRepository.getAsztalById(2);

                expect(updated).toBeDefined();
                expect(updated.helyek_szama).toEqual(5);
            });
        });

        describe("deleteAsztal method tests", () => 
        {
            test("should delete an asztal from the database", async () => 
            {
                const deleted = await asztalRepository.deleteAsztal(3);

                expect(deleted).toBe(true);

                const asztalok = await asztalRepository.getAsztal();
                const foundAsztal = asztalok.find(item => item.id === 3);

                expect(foundAsztal).toBeUndefined();
            });
        });
    });
});

