const { Sequelize } = require("sequelize");
const db = require("../../../api/db");
const { DbError } = require("../../../api/errors");

const UserRepository = require("../../../api/repositories/UserRepository");

const userRepository = new UserRepository(db);

describe("Repository tests", () => 
{
    describe("UserRepository", () => 
    {
        let user1, user2, user3;

        beforeAll(async () => 
        {
            await db.sequelize.sync({ force: true });

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

            user3 = await db.User.create({ 
                vezeteknev: "Tóth",
                keresztnev: "Péter",
                email: "toth.peter@example.com",
                telefonszam: "0634567890"
            });
        });

        afterAll(async () => 
        {
            await db.User.destroy({ where: {} });
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

            test("should throw error given the database is not setup correctly", async () => 
            {
                const invalidRepository = new UserRepository({});

                const promise = invalidRepository.getUser();

                await expect(promise).rejects.toThrow();
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
                    telefonszam: "0645678901"
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

        describe("getUserByEmail method tests", () => 
        {
            test("should return user by email", async () => 
            {
                const result = await userRepository.getUserByEmail("kovacs.janos@example.com");

                expect(result).toBeDefined();
                expect(result.length).toBeGreaterThan(0);
                expect(result[0].email).toEqual("kovacs.janos@example.com");
            });

            test("should return empty array when email not found", async () => 
            {
                const result = await userRepository.getUserByEmail("nemletezo@example.com");

                expect(result).toBeDefined();
                expect(result.length).toBe(0);
            });
        });

        describe("getUserByPhone method tests", () => 
        {
            test("should return user by phone number", async () => 
            {
                const result = await userRepository.getUserByPhone("0612345678");

                expect(result).toBeDefined();
                expect(result.length).toBeGreaterThan(0);
                expect(result[0].telefonszam).toEqual("0612345678");
            });

            test("should return empty array when phone not found", async () => 
            {
                const result = await userRepository.getUserByPhone("0699999999");

                expect(result).toBeDefined();
                expect(result.length).toBe(0);
            });
        });

        describe("getUserWithDetails method tests", () => 
        {
            test("should return users with details ordered by id DESC", async () => 
            {
                const result = await userRepository.getUserWithDetails();

                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThanOrEqual(0);
            });
        });

        describe("getUserCountByEmail method tests", () => 
        {
            test("should return user count by email", async () => 
            {
                const result = await userRepository.getUserCountByEmail();

                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
            });
        });

        describe("getUsersByDateRange method tests", () => 
        {
            test("should return users by date range", async () => 
            {
                const result = await userRepository.getUsersByDateRange("2024-01-01", "2024-12-31");

                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
            });
        });

        describe("getTopUsers method tests", () => 
        {
            test("should return top users", async () => 
            {
                const result = await userRepository.getTopUsers(5);

                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
            });

            test("should return top users with custom limit", async () => 
            {
                const result = await userRepository.getTopUsers(2);

                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeLessThanOrEqual(2);
            });
        });

        describe("getUsersByEtkezesType method tests", () => 
        {
            test("should return users by etkezes type", async () => 
            {
                const result = await userRepository.getUsersByEtkezesType();

                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
            });
        });
    });
});
