const { Sequelize } = require("sequelize");
const db = require("../api/db");
const { DbError } = require("../api/errors");

const FoglaloRepository = require("../api/repositories/FoglaloRepository");

const foglaloRepository = new FoglaloRepository(db);

describe("Repository tests", () => 
{
    describe("FoglaloRepository", () => 
    {
        const foglalok =
        [
            { 
                foglalo_id: 1,
                vezeteknev: "Kovács", 
                keresztnev: "János", 
                email: "kovacs.janos@example.com",
                telefonszam: "0612345678",
                megjegyzes: "Test megjegyzés 1"
            },
            { 
                foglalo_id: 2,
                vezeteknev: "Nagy", 
                keresztnev: "Mária", 
                email: "nagy.maria@example.com",
                telefonszam: "0623456789",
                megjegyzes: "Test megjegyzés 2"
            },
            { 
                foglalo_id: 3,
                vezeteknev: "Szabó", 
                keresztnev: "Péter", 
                email: "szabo.peter@example.com",
                telefonszam: "0634567890",
                megjegyzes: "Test megjegyzés 3"
            },
        ];

        let foglaloResults;

        beforeAll(async () => 
        {
            await db.sequelize.sync({ force: true });

            await db.Foglalo.bulkCreate(foglalok);

            foglaloResults = await foglaloRepository.getFoglalo();
        });

        afterAll(async () => 
        {
            await db.Foglalo.destroy({ where: {} });
        });

        describe("getFoglalo method tests", () => 
        {
            test("getFoglalo returns correct values from db", async () => 
            {
                expect(foglaloResults.length).toBeGreaterThanOrEqual(foglalok.length);
            });

            test("the first foglalo vezeteknev must be Kovács", () => 
            {
                const firstFoglalo = foglaloResults.find(f => f.vezeteknev === "Kovács");
                expect(firstFoglalo).toBeDefined();
                expect(firstFoglalo.vezeteknev).toEqual("Kovács");
            });

            test("should throw error given the database is not setup correctly", async () => 
            {
                const invalidRepository = new FoglaloRepository({});

                const promise = invalidRepository.getFoglalo();

                await expect(promise).rejects.toThrow();
            });
        });

        describe("getFoglaloByEmail method tests", () => 
        {
            test("should return foglalo by email", async () => 
            {
                const result = await foglaloRepository.getFoglaloByEmail("kovacs.janos@example.com");

                expect(result).toBeDefined();
                expect(result.length).toBeGreaterThan(0);
                expect(result[0].email).toEqual("kovacs.janos@example.com");
            });

            test("should return empty array when email not found", async () => 
            {
                const result = await foglaloRepository.getFoglaloByEmail("nonexistent@example.com");

                expect(result).toBeDefined();
                expect(result.length).toBe(0);
            });
        });

        describe("createFoglalo method tests", () => 
        {
            test("should create a foglalo in the database", async () => 
            {
                const foglalo = { 
                    vezeteknev: "Tóth", 
                    keresztnev: "Anna", 
                    email: "toth.anna@example.com",
                    telefonszam: "0645678901",
                    megjegyzes: "Test megjegyzés 4"
                };

                await foglaloRepository.createFoglalo(foglalo);

                const foglalok = await foglaloRepository.getFoglalo();

                const foundFoglalo = foglalok.find(item => item.email === "toth.anna@example.com");

                expect(foundFoglalo).toBeDefined();
                expect(foundFoglalo.vezeteknev).toEqual("Tóth");
            });
        });

        describe("updateFoglalo method tests", () => 
        {
            test("should update a foglalo in the database", async () => 
            {
                const updateData = {
                    keresztnev: "Jánosné"
                };

                await foglaloRepository.updateFoglalo(1, updateData);

                const updated = await foglaloRepository.getFoglaloByEmail("kovacs.janos@example.com");

                expect(updated).toBeDefined();
                if (updated.length > 0) {
                    expect(updated[0].keresztnev).toEqual("Jánosné");
                }
            });
        });

        describe("deleteFoglalo method tests", () => 
        {
            test("should delete a foglalo from the database", async () => 
            {
                const deleted = await foglaloRepository.deleteFoglalo(3);

                expect(deleted).toBe(true);

                const foglalok = await foglaloRepository.getFoglalo();
                const foundFoglalo = foglalok.find(item => item.foglalo_id === 3);

                expect(foundFoglalo).toBeUndefined();
            });
        });
    });
});

