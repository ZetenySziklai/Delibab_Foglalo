const { Sequelize } = require("sequelize");
const db = require("../../../api/db");
const { DbError } = require("../../../api/errors");

const FelhasznaloRepository = require("../../../api/repositories/FelhasznaloRepository");

const userRepository = new FelhasznaloRepository(db);

describe("Repository tests", () => 
{
    describe("FelhasznaloRepository", () => 
    {
        let user1, user2, user3;

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

            user2 = await db.Felhasznalo.create({ 
                vezeteknev: "Nagy",
                keresztnev: "Mária",
                email: "nagy.maria@example.com",
                telefonszam: "0623456789",
                jelszo: "pass"
            });

            user3 = await db.Felhasznalo.create({ 
                vezeteknev: "Tóth",
                keresztnev: "Péter",
                email: "toth.peter@example.com",
                telefonszam: "0634567890",
                jelszo: "pass"
            });
        });

        afterAll(async () => 
        {
            await db.Felhasznalo.destroy({ where: {} });
        });

        describe("getUser method tests", () => 
        {
            test("getUser returns correct values from db", async () => 
            {
                const results = await userRepository.getUser();

                expect(results.length).toBeGreaterThanOrEqual(3);
            });

            test("the first user vezeteknev must be Kovács", async () => 
            {
                const results = await userRepository.getUser();
                const firstUser = results.find(u => u.email === "kovacs.janos@example.com");
                expect(firstUser).toBeDefined();
                expect(firstUser.vezeteknev).toEqual("Kovács");
            });
        });

        describe("getUserById method tests", () => 
        {
            test("should return user by id", async () => 
            {
                const result = await userRepository.getUserById(user1.id);

                expect(result).toBeDefined();
                expect(result.id).toBe(user1.id);
                expect(result.vezeteknev).toEqual("Kovács");
                expect(result.email).toEqual("kovacs.janos@example.com");
            });

            test("should return null when id not found", async () => 
            {
                const result = await userRepository.getUserById(999);

                expect(result).toBeNull();
            });
        });

        describe("createUser method tests", () => 
        {
            test("should create a user in the database", async () => 
            {
                const user = { 
                    vezeteknev: "Szabó",
                    keresztnev: "Anna",
                    email: "szabo.anna@example.com",
                    telefonszam: "0645678901",
                    jelszo: "pass"
                };

                await userRepository.createUser(user);

                const users = await userRepository.getUser();

                const foundUser = users.find(item => item.email === "szabo.anna@example.com");

                expect(foundUser).toBeDefined();
                expect(foundUser.vezeteknev).toEqual("Szabó");
            });
        });

        describe("updateUser method tests", () => 
        {
            test("should update a user in the database", async () => 
            {
                const updateData = {
                    vezeteknev: "Nagy-Kovács",
                    email: "nagy.kovacs.maria@example.com"
                };

                await userRepository.updateUser(user2.id, updateData);

                const updated = await userRepository.getUserById(user2.id);

                expect(updated).toBeDefined();
                expect(updated.vezeteknev).toEqual("Nagy-Kovács");
                expect(updated.email).toEqual("nagy.kovacs.maria@example.com");
            });
        });

        describe("deleteUser method tests", () => 
        {
            test("should delete a user from the database", async () => 
            {
                const deleted = await userRepository.deleteUser(user3.id);

                expect(deleted).toBe(true);

                const users = await userRepository.getUser();
                const foundUser = users.find(item => item.id === user3.id);

                expect(foundUser).toBeUndefined();
            });
        });
    });
});
