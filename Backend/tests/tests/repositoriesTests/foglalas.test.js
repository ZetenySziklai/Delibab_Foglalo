const { Sequelize } = require("sequelize");
const db = require("../api/db");
const { DbError } = require("../api/errors");

const FoglalasRepository = require("../api/repositories/FoglalasRepository");

const foglalasRepository = new FoglalasRepository(db);

describe("Repository tests", () => 
{
    describe("FoglalasRepository", () => 
    {
        let user1, user2, asztal1, asztal2, asztalAllapot, etkezesTipusa1, etkezesTipusa2, megjegyzes1;

        beforeAll(async () => 
        {
            await db.sequelize.sync({ force: true });

            // Először létrehozunk szükséges függőségeket
            user1 = await db.User.create({ 
                vezeteknev: "Kovács",
                keresztnev: "János",
                email: "kovacs.janos@example.com",
                telefonszam: "0612345678"
            });

            user2 = await db.User.create({ 
                vezeteknev: "Nagy",
                keresztnev: "Mária",
                email: "nagy.maria@example.com",
                telefonszam: "0623456789"
            });

            asztalAllapot = await db.AsztalAllapot.create({ nev: "Szabad" });

            asztal1 = await db.Asztal.create({ 
                helyek_szama: 4, 
                asztal_allapot_id: asztalAllapot.id 
            });

            asztal2 = await db.Asztal.create({ 
                helyek_szama: 6, 
                asztal_allapot_id: asztalAllapot.id 
            });

            etkezesTipusa1 = await db.EtkezesTipusa.create({ nev: "Ebéd" });
            etkezesTipusa2 = await db.EtkezesTipusa.create({ nev: "Vacsora" });

            megjegyzes1 = await db.Megjegyzes.create({ szoveg: "Test megjegyzés" });

            // Létrehozunk foglalásokat
            await db.Foglalas.bulkCreate([
                { 
                    id: 1,
                    user_id: user1.id,
                    asztal_id: asztal1.id,
                    foglalas_datum: new Date("2024-01-15 12:00:00"),
                    etkezes_id: etkezesTipusa1.id,
                    megjegyzes_id: megjegyzes1.id
                },
                { 
                    id: 2,
                    user_id: user2.id,
                    asztal_id: asztal2.id,
                    foglalas_datum: new Date("2024-01-15 13:00:00"),
                    etkezes_id: etkezesTipusa1.id
                },
                { 
                    id: 3,
                    user_id: user1.id,
                    asztal_id: asztal1.id,
                    foglalas_datum: new Date("2024-01-16 18:00:00"),
                    etkezes_id: etkezesTipusa2.id
                },
            ]);
        });

        afterAll(async () => 
        {
            await db.Foglalas.destroy({ where: {} });
            await db.Megjegyzes.destroy({ where: {} });
            await db.EtkezesTipusa.destroy({ where: {} });
            await db.Asztal.destroy({ where: {} });
            await db.AsztalAllapot.destroy({ where: {} });
            await db.User.destroy({ where: {} });
        });

        describe("getFoglalas method tests", () => 
        {
            test("getFoglalas returns correct values from db", async () => 
            {
                const results = await foglalasRepository.getFoglalas();

                expect(results.length).toBeGreaterThanOrEqual(3);
            });

            test("should throw error given the database is not setup correctly", async () => 
            {
                const invalidRepository = new FoglalasRepository({});

                const promise = invalidRepository.getFoglalas();

                await expect(promise).rejects.toThrow();
            });
        });

        describe("getFoglalasById method tests", () => 
        {
            test("should return foglalas by id", async () => 
            {
                const result = await foglalasRepository.getFoglalasById(1);

                expect(result).toBeDefined();
                expect(result.id).toBe(1);
                expect(result.user_id).toBe(user1.id);
                expect(result.asztal_id).toBe(asztal1.id);
            });

            test("should return null when id not found", async () => 
            {
                const result = await foglalasRepository.getFoglalasById(999);

                expect(result).toBeNull();
            });
        });

        describe("createFoglalas method tests", () => 
        {
            test("should create a foglalas in the database", async () => 
            {
                const foglalas = { 
                    user_id: user2.id,
                    asztal_id: asztal2.id,
                    foglalas_datum: new Date("2024-01-17 19:00:00"),
                    etkezes_id: etkezesTipusa2.id
                };

                await foglalasRepository.createFoglalas(foglalas);

                const foglalasok = await foglalasRepository.getFoglalas();

                const foundFoglalas = foglalasok.find(item => 
                    item.user_id === user2.id && 
                    item.asztal_id === asztal2.id &&
                    new Date(item.foglalas_datum).getTime() === new Date("2024-01-17 19:00:00").getTime()
                );

                expect(foundFoglalas).toBeDefined();
            });
        });

        describe("updateFoglalas method tests", () => 
        {
            test("should update a foglalas in the database", async () => 
            {
                const updateData = {
                    foglalas_datum: new Date("2024-01-15 14:00:00")
                };

                await foglalasRepository.updateFoglalas(2, updateData);

                const updated = await foglalasRepository.getFoglalasById(2);

                expect(updated).toBeDefined();
                expect(new Date(updated.foglalas_datum).getTime()).toEqual(new Date("2024-01-15 14:00:00").getTime());
            });
        });

        describe("deleteFoglalas method tests", () => 
        {
            test("should delete a foglalas from the database", async () => 
            {
                const deleted = await foglalasRepository.deleteFoglalas(3);

                expect(deleted).toBe(true);

                const foglalasok = await foglalasRepository.getFoglalas();
                const foundFoglalas = foglalasok.find(item => item.id === 3);

                expect(foundFoglalas).toBeUndefined();
            });
        });

        describe("getFoglaltIdopontok method tests", () => 
        {
            test("should return foglalt idopontok by datum and asztal", async () => 
            {
                const result = await foglalasRepository.getFoglaltIdopontok("2024-01-15", asztal1.id);

                expect(result).toBeDefined();
                expect(result.length).toBeGreaterThan(0);
                expect(result[0].asztal_id).toBe(asztal1.id);
            });

            test("should return empty array when no foglalas found", async () => 
            {
                const result = await foglalasRepository.getFoglaltIdopontok("2024-01-20", asztal1.id);

                expect(result).toBeDefined();
                expect(result.length).toBe(0);
            });
        });

        describe("getAllReservedTimesByDate method tests", () => 
        {
            test("should return all reserved times by date", async () => 
            {
                const result = await foglalasRepository.getAllReservedTimesByDate("2024-01-15");

                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);
            });

            test("should return empty array when no foglalas found for date", async () => 
            {
                const result = await foglalasRepository.getAllReservedTimesByDate("2024-01-20");

                expect(result).toBeDefined();
                expect(result.length).toBe(0);
            });
        });

        describe("getFoglalasByDatum method tests", () => 
        {
            test("should return foglalas by datum", async () => 
            {
                const result = await foglalasRepository.getFoglalasByDatum("2024-01-15");

                expect(result).toBeDefined();
                expect(result.length).toBeGreaterThan(0);
            });

            test("should return empty array when no foglalas found for date", async () => 
            {
                const result = await foglalasRepository.getFoglalasByDatum("2024-01-20");

                expect(result).toBeDefined();
                expect(result.length).toBe(0);
            });
        });

        describe("getFoglalasByUser method tests", () => 
        {
            test("should return foglalas by user id", async () => 
            {
                const result = await foglalasRepository.getFoglalasByUser(user1.id);

                expect(result).toBeDefined();
                expect(result.length).toBeGreaterThan(0);
                expect(result[0].user_id).toBe(user1.id);
            });

            test("should return empty array when no foglalas found for user", async () => 
            {
                const newUser = await db.User.create({ 
                    vezeteknev: "Teszt",
                    keresztnev: "User",
                    email: "teszt.user@example.com",
                    telefonszam: "0699999999"
                });

                const result = await foglalasRepository.getFoglalasByUser(newUser.id);

                expect(result).toBeDefined();
                expect(result.length).toBe(0);

                await db.User.destroy({ where: { id: newUser.id } });
            });
        });
    });
});

