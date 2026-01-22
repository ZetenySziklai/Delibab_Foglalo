const { Sequelize } = require("sequelize");
const db = require("../api/db");
const { DbError } = require("../api/errors");

const AllergenRepository = require("../api/repositories/AllergenRepository");

const allergenRepository = new AllergenRepository(db);

describe("Repository tests", () => 
{
    describe("AllergenRepository", () => 
    {
        const allergenek =
        [
            { 
                id: 1,
                nev: "Glutén"
            },
            { 
                id: 2,
                nev: "Tej"
            },
            { 
                id: 3,
                nev: "Tojás"
            },
        ];

        let allergenResults;

        beforeAll(async () => 
        {
            await db.sequelize.sync({ force: true });

            await db.Allergen.bulkCreate(allergenek);

            allergenResults = await allergenRepository.getAllergen();
        });

        afterAll(async () => 
        {
            await db.Allergen.destroy({ where: {} });
        });

        describe("getAllergen method tests", () => 
        {
            test("getAllergen returns correct values from db", async () => 
            {
                expect(allergenResults.length).toBeGreaterThanOrEqual(allergenek.length);
            });

            test("the first allergen nev must be Glutén", () => 
            {
                const firstAllergen = allergenResults.find(a => a.nev === "Glutén");
                expect(firstAllergen).toBeDefined();
                expect(firstAllergen.nev).toEqual("Glutén");
            });

            test("should throw error given the database is not setup correctly", async () => 
            {
                const invalidRepository = new AllergenRepository({});

                const promise = invalidRepository.getAllergen();

                await expect(promise).rejects.toThrow();
            });
        });

        describe("getAllergenById method tests", () => 
        {
            test("should return allergen by id", async () => 
            {
                const result = await allergenRepository.getAllergenById(1);

                expect(result).toBeDefined();
                expect(result.id).toBe(1);
                expect(result.nev).toEqual("Glutén");
            });

            test("should return null when id not found", async () => 
            {
                const result = await allergenRepository.getAllergenById(999);

                expect(result).toBeNull();
            });
        });

        describe("createAllergen method tests", () => 
        {
            test("should create an allergen in the database", async () => 
            {
                const allergen = { 
                    nev: "Hal"
                };

                await allergenRepository.createAllergen(allergen);

                const allergenek = await allergenRepository.getAllergen();

                const foundAllergen = allergenek.find(item => item.nev === "Hal");

                expect(foundAllergen).toBeDefined();
                expect(foundAllergen.nev).toEqual("Hal");
            });
        });

        describe("updateAllergen method tests", () => 
        {
            test("should update an allergen in the database", async () => 
            {
                const updateData = {
                    nev: "Tejfehérje"
                };

                await allergenRepository.updateAllergen(2, updateData);

                const updated = await allergenRepository.getAllergenById(2);

                expect(updated).toBeDefined();
                expect(updated.nev).toEqual("Tejfehérje");
            });
        });

        describe("deleteAllergen method tests", () => 
        {
            test("should delete an allergen from the database", async () => 
            {
                const deleted = await allergenRepository.deleteAllergen(3);

                expect(deleted).toBe(true);

                const allergenek = await allergenRepository.getAllergen();
                const foundAllergen = allergenek.find(item => item.id === 3);

                expect(foundAllergen).toBeUndefined();
            });
        });
    });
});

