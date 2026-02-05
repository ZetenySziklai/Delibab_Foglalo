const { Sequelize } = require("sequelize");
const db = require("../../../api/db");
const { DbError } = require("../../../api/errors");

const EtkezesTipusaRepository = require("../../../api/repositories/EtkezesTipusaRepository");

const etkezesTipusaRepository = new EtkezesTipusaRepository(db);

describe("Repository tests", () => 
{
    describe("EtkezesTipusaRepository", () => 
    {
        const etkezesTipusok =
        [
            { 
                id: 1,
                nev: "Ebéd"
            },
            { 
                id: 2,
                nev: "Vacsora"
            },
            { 
                id: 3,
                nev: "Reggeli"
            },
        ];

        let etkezesTipusaResults;

        beforeAll(async () => 
        {
            await db.sequelize.sync({ force: true });

            await db.EtkezesTipusa.bulkCreate(etkezesTipusok);

            etkezesTipusaResults = await etkezesTipusaRepository.getEtkezesTipusa();
        });

        afterAll(async () => 
        {
            await db.EtkezesTipusa.destroy({ where: {} });
        });

        describe("getEtkezesTipusa method tests", () => 
        {
            test("getEtkezesTipusa returns correct values from db", async () => 
            {
                expect(etkezesTipusaResults.length).toBeGreaterThanOrEqual(etkezesTipusok.length);
            });

            test("the first etkezesTipusa nev must be Ebéd", () => 
            {
                const firstEtkezesTipusa = etkezesTipusaResults.find(e => e.nev === "Ebéd");
                expect(firstEtkezesTipusa).toBeDefined();
                expect(firstEtkezesTipusa.nev).toEqual("Ebéd");
            });

            test("should throw error given the database is not setup correctly", async () => 
            {
                const invalidRepository = new EtkezesTipusaRepository({});

                const promise = invalidRepository.getEtkezesTipusa();

                await expect(promise).rejects.toThrow();
            });
        });

        describe("getEtkezesTipusaById method tests", () => 
        {
            test("should return etkezesTipusa by id", async () => 
            {
                const result = await etkezesTipusaRepository.getEtkezesTipusaById(1);

                expect(result).toBeDefined();
                expect(result.id).toBe(1);
                expect(result.nev).toEqual("Ebéd");
            });

            test("should return null when id not found", async () => 
            {
                const result = await etkezesTipusaRepository.getEtkezesTipusaById(999);

                expect(result).toBeNull();
            });
        });

        describe("createEtkezesTipusa method tests", () => 
        {
            test("should create an etkezesTipusa in the database", async () => 
            {
                const etkezesTipusa = { 
                    nev: "Uzsonna"
                };

                await etkezesTipusaRepository.createEtkezesTipusa(etkezesTipusa);

                const etkezesTipusokList = await etkezesTipusaRepository.getEtkezesTipusa();

                const foundEtkezesTipusa = etkezesTipusokList.find(item => item.nev === "Uzsonna");

                expect(foundEtkezesTipusa).toBeDefined();
                expect(foundEtkezesTipusa.nev).toEqual("Uzsonna");
            });
        });

        describe("updateEtkezesTipusa method tests", () => 
        {
            test("should update an etkezesTipusa in the database", async () => 
            {
                const updateData = {
                    nev: "Ebéd - Késői"
                };

                await etkezesTipusaRepository.updateEtkezesTipusa(2, updateData);

                const updated = await etkezesTipusaRepository.getEtkezesTipusaById(2);

                expect(updated).toBeDefined();
                expect(updated.nev).toEqual("Ebéd - Késői");
            });
        });

        describe("deleteEtkezesTipusa method tests", () => 
        {
            test("should delete an etkezesTipusa from the database", async () => 
            {
                const deleted = await etkezesTipusaRepository.deleteEtkezesTipusa(3);

                expect(deleted).toBe(true);

                const etkezesTipusokList = await etkezesTipusaRepository.getEtkezesTipusa();
                const foundEtkezesTipusa = etkezesTipusokList.find(item => item.id === 3);

                expect(foundEtkezesTipusa).toBeUndefined();
            });
        });
    });
});
