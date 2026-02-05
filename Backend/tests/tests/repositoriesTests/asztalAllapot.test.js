const { Sequelize } = require("sequelize");
const db = require("../../../api/db");
const { DbError } = require("../../../api/errors");

const AsztalAllapotRepository = require("../../../api/repositories/AsztalAllapotRepository");

const asztalAllapotRepository = new AsztalAllapotRepository(db);

describe("Repository tests", () => 
{
    describe("AsztalAllapotRepository", () => 
    {
        const asztalAllapotok =
        [
            { 
                id: 1,
                nev: "Szabad"
            },
            { 
                id: 2,
                nev: "Foglalt"
            },
            { 
                id: 3,
                nev: "Karbantartás"
            },
        ];

        let asztalAllapotResults;

        beforeAll(async () => 
        {
            await db.sequelize.sync({ force: true });

            await db.AsztalAllapot.bulkCreate(asztalAllapotok);

            asztalAllapotResults = await asztalAllapotRepository.getAsztalAllapot();
        });

        afterAll(async () => 
        {
            await db.AsztalAllapot.destroy({ where: {} });
        });

        describe("getAsztalAllapot method tests", () => 
        {
            test("getAsztalAllapot returns correct values from db", async () => 
            {
                expect(asztalAllapotResults.length).toBeGreaterThanOrEqual(asztalAllapotok.length);
            });

            test("the first asztalAllapot nev must be Szabad", () => 
            {
                const firstAsztalAllapot = asztalAllapotResults.find(a => a.nev === "Szabad");
                expect(firstAsztalAllapot).toBeDefined();
                expect(firstAsztalAllapot.nev).toEqual("Szabad");
            });

            test("should throw error given the database is not setup correctly", async () => 
            {
                const invalidRepository = new AsztalAllapotRepository({});

                const promise = invalidRepository.getAsztalAllapot();

                await expect(promise).rejects.toThrow();
            });
        });

        describe("getAsztalAllapotById method tests", () => 
        {
            test("should return asztalAllapot by id", async () => 
            {
                const result = await asztalAllapotRepository.getAsztalAllapotById(1);

                expect(result).toBeDefined();
                expect(result.id).toBe(1);
                expect(result.nev).toEqual("Szabad");
            });

            test("should return null when id not found", async () => 
            {
                const result = await asztalAllapotRepository.getAsztalAllapotById(999);

                expect(result).toBeNull();
            });
        });

        describe("createAsztalAllapot method tests", () => 
        {
            test("should create an asztalAllapot in the database", async () => 
            {
                const asztalAllapot = { 
                    nev: "Törött"
                };

                await asztalAllapotRepository.createAsztalAllapot(asztalAllapot);

                const asztalAllapotok = await asztalAllapotRepository.getAsztalAllapot();

                const foundAsztalAllapot = asztalAllapotok.find(item => item.nev === "Törött");

                expect(foundAsztalAllapot).toBeDefined();
                expect(foundAsztalAllapot.nev).toEqual("Törött");
            });
        });

        describe("updateAsztalAllapot method tests", () => 
        {
            test("should update an asztalAllapot in the database", async () => 
            {
                const updateData = {
                    nev: "Foglalt - Karbantartás"
                };

                await asztalAllapotRepository.updateAsztalAllapot(2, updateData);

                const updated = await asztalAllapotRepository.getAsztalAllapotById(2);

                expect(updated).toBeDefined();
                expect(updated.nev).toEqual("Foglalt - Karbantartás");
            });
        });

        describe("deleteAsztalAllapot method tests", () => 
        {
            test("should delete an asztalAllapot from the database", async () => 
            {
                const deleted = await asztalAllapotRepository.deleteAsztalAllapot(3);

                expect(deleted).toBe(true);

                const asztalAllapotok = await asztalAllapotRepository.getAsztalAllapot();
                const foundAsztalAllapot = asztalAllapotok.find(item => item.id === 3);

                expect(foundAsztalAllapot).toBeUndefined();
            });
        });
    });
});

