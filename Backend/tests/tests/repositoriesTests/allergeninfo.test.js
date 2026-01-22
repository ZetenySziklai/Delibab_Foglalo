const { Sequelize } = require("sequelize");
const db = require("../api/db");
const { DbError } = require("../api/errors");

const AllergeninfoRepository = require("../api/repositories/AllergeninfoRepository");

const allergeninfoRepository = new AllergeninfoRepository(db);

describe("Repository tests", () => 
{
    describe("AllergeninfoRepository", () => 
    {
        let allergen1, allergen2, foglalas1, foglalas2;

        beforeAll(async () => 
        {
            await db.sequelize.sync({ force: true });

            // Először létrehozunk allergéneket
            allergen1 = await db.Allergen.create({ nev: "Glutén" });
            allergen2 = await db.Allergen.create({ nev: "Tej" });

            // Létrehozunk egy user-t és asztal állapotot a foglaláshoz
            const user = await db.User.create({ 
                username: "testuser", 
                password: "testpass",
                email: "test@example.com"
            });

            const asztalAllapot = await db.AsztalAllapot.create({ nev: "Szabad" });
            const asztal = await db.Asztal.create({ 
                helyek_szama: 4, 
                asztal_allapot_id: asztalAllapot.id 
            });

            const etkezesTipusa = await db.EtkezesTipusa.create({ nev: "Ebéd" });

            // Létrehozunk foglalásokat
            foglalas1 = await db.Foglalas.create({
                user_id: user.id,
                asztal_id: asztal.id,
                foglalas_datum: new Date("2024-01-15 12:00:00"),
                etkezes_id: etkezesTipusa.id
            });

            foglalas2 = await db.Foglalas.create({
                user_id: user.id,
                asztal_id: asztal.id,
                foglalas_datum: new Date("2024-01-16 13:00:00"),
                etkezes_id: etkezesTipusa.id
            });

            // Létrehozunk allergeninfo rekordokat
            await db.Allergeninfo.bulkCreate([
                { 
                    allergen_id: allergen1.id,
                    foglalas_id: foglalas1.id
                },
                { 
                    allergen_id: allergen2.id,
                    foglalas_id: foglalas1.id
                },
                { 
                    allergen_id: allergen1.id,
                    foglalas_id: foglalas2.id
                },
            ]);
        });

        afterAll(async () => 
        {
            await db.Allergeninfo.destroy({ where: {} });
            await db.Foglalas.destroy({ where: {} });
            await db.Asztal.destroy({ where: {} });
            await db.AsztalAllapot.destroy({ where: {} });
            await db.EtkezesTipusa.destroy({ where: {} });
            await db.User.destroy({ where: {} });
            await db.Allergen.destroy({ where: {} });
        });

        describe("getAllergeninfo method tests", () => 
        {
            test("getAllergeninfo returns correct values from db", async () => 
            {
                const results = await allergeninfoRepository.getAllergeninfo();

                expect(results.length).toBeGreaterThanOrEqual(3);
            });

            test("should throw error given the database is not setup correctly", async () => 
            {
                const invalidRepository = new AllergeninfoRepository({});

                const promise = invalidRepository.getAllergeninfo();

                await expect(promise).rejects.toThrow();
            });
        });

        describe("getAllergeninfoById method tests", () => 
        {
            test("should return allergeninfo by id", async () => 
            {
                const result = await allergeninfoRepository.getAllergeninfoById(1);

                expect(result).toBeDefined();
                expect(result.id).toBe(1);
                expect(result.allergen_id).toBe(allergen1.id);
                expect(result.foglalas_id).toBe(foglalas1.id);
            });

            test("should return null when id not found", async () => 
            {
                const result = await allergeninfoRepository.getAllergeninfoById(999);

                expect(result).toBeNull();
            });
        });

        describe("getAllergeninfoByFoglalas method tests", () => 
        {
            test("should return allergeninfo by foglalas id", async () => 
            {
                const result = await allergeninfoRepository.getAllergeninfoByFoglalas(foglalas1.id);

                expect(result).toBeDefined();
                expect(result.length).toBeGreaterThanOrEqual(2);
                expect(result[0].foglalas_id).toBe(foglalas1.id);
            });

            test("should return empty array when foglalas id not found", async () => 
            {
                const result = await allergeninfoRepository.getAllergeninfoByFoglalas(999);

                expect(result).toBeDefined();
                expect(result.length).toBe(0);
            });
        });

        describe("createAllergeninfo method tests", () => 
        {
            test("should create an allergeninfo in the database", async () => 
            {
                const allergeninfo = { 
                    allergen_id: allergen2.id,
                    foglalas_id: foglalas2.id
                };

                await allergeninfoRepository.createAllergeninfo(allergeninfo);

                const allergeninfok = await allergeninfoRepository.getAllergeninfo();
                const foundAllergeninfo = allergeninfok.find(item => 
                    item.allergen_id === allergen2.id && item.foglalas_id === foglalas2.id
                );

                expect(foundAllergeninfo).toBeDefined();
            });
        });

        describe("updateAllergeninfo method tests", () => 
        {
            test("should update an allergeninfo in the database", async () => 
            {
                const updateData = {
                    allergen_id: allergen2.id
                };

                await allergeninfoRepository.updateAllergeninfo(1, updateData);

                const updated = await allergeninfoRepository.getAllergeninfoById(1);

                expect(updated).toBeDefined();
                expect(updated.allergen_id).toEqual(allergen2.id);
            });
        });

        describe("deleteAllergeninfo method tests", () => 
        {
            test("should delete an allergeninfo from the database", async () => 
            {
                const deleted = await allergeninfoRepository.deleteAllergeninfo(2);

                expect(deleted).toBe(true);

                const allergeninfok = await allergeninfoRepository.getAllergeninfo();
                const foundAllergeninfo = allergeninfok.find(item => item.id === 2);

                expect(foundAllergeninfo).toBeUndefined();
            });
        });

        describe("deleteAllergeninfoByFoglalas method tests", () => 
        {
            test("should delete allergeninfo by foglalas id", async () => 
            {
                const deleted = await allergeninfoRepository.deleteAllergeninfoByFoglalas(foglalas2.id);

                expect(deleted).toBe(true);

                const allergeninfok = await allergeninfoRepository.getAllergeninfoByFoglalas(foglalas2.id);

                expect(allergeninfok.length).toBe(0);
            });
        });
    });
});

