const request = require("supertest");

const app = require("../../app");

const db = require("../../api/db");

describe("API Tests", () => 
{
    beforeAll(async () => 
    {
        await db.sequelize.sync();
    });

    describe("/api/users", () => 
    {
        const users = 
        [
            { 
                vezeteknev: "Kovács", 
                keresztnev: "János", 
                email: "kovacs.janos@example.com",
                telefonszam: "0612345678"
            },  
            { 
                vezeteknev: "Nagy", 
                keresztnev: "Mária", 
                email: "nagy.maria@example.com",
                telefonszam: "0623456789"
            },  
            { 
                vezeteknev: "Szabó", 
                keresztnev: "Péter", 
                email: "szabo.peter@example.com",
                telefonszam: "0634567890"
            },  
        ];

        let createdUsers;

        beforeEach(async () => 
        {
            // Töröljük az összes adatot, hogy tiszta legyen az adatbázis
            await db.User.destroy({ where: {} });
            // Létrehozzuk a felhasználókat és eltároljuk az ID-kat
            createdUsers = await db.User.bulkCreate(users);
        });

        afterEach(async () => 
        {
            await db.User.destroy({ where: {} });
        });

        describe("GET", () => 
        {
            test("should return all the users", async () => 
            {
                const res = await request(app).get("/api/users")
                .set("Accept", "application/json");

                expect(res.status).toBe(200);

                expect(res.type).toMatch(/json/);

                expect(res.body.length).toBeGreaterThanOrEqual(users.length);
            });
        });

        describe("POST", () => 
        {
            test("should create a user", async () => 
            {
                const user = { 
                    vezeteknev: "Tóth", 
                    keresztnev: "Anna", 
                    email: "toth.anna@example.com",
                    telefonszam: "0645678901"
                };

                const res = await request(app).post("/api/users").send(user);

                expect(res.status).toBe(201);
                expect(res.type).toMatch(/json/);
                expect(res.body.vezeteknev).toEqual(user.vezeteknev);
                expect(res.body.keresztnev).toEqual(user.keresztnev);
                expect(res.body.email).toEqual(user.email);

                const foundUser = await db.User.findOne(
                {
                    where: { email: "toth.anna@example.com" }
                });

                expect(foundUser).toBeDefined();
                expect(foundUser.vezeteknev).toEqual("Tóth");
                expect(foundUser.keresztnev).toEqual("Anna");
            });

            test("should return 400 when required fields are missing", async () => 
            {
                const user = { 
                    vezeteknev: "Tóth",
                    email: "toth@example.com",
                    telefonszam: "0645678901"
                };

                const res = await request(app).post("/api/users").send(user);

                expect(res.status).toBe(400);
            });

            test("should return 400 when vezeteknev contains numbers", async () => 
            {
                const user = { 
                    vezeteknev: "Tóth123", 
                    keresztnev: "Anna", 
                    email: "toth@example.com",
                    telefonszam: "0645678901"
                };

                const res = await request(app).post("/api/users").send(user);

                expect(res.status).toBe(400);
            });

            test("should return 400 when email is invalid", async () => 
            {
                const user = { 
                    vezeteknev: "Tóth", 
                    keresztnev: "Anna", 
                    email: "invalid-email",
                    telefonszam: "0645678901"
                };

                const res = await request(app).post("/api/users").send(user);

                expect(res.status).toBe(400);
            });
        });

        describe("GET /:id", () => 
        {
            test("should return user by id", async () => 
            {
                const userId = createdUsers[0].id;
                const res = await request(app).get(`/api/users/${userId}`)
                .set("Accept", "application/json");

                expect(res.status).toBe(200);
                expect(res.type).toMatch(/json/);
                expect(res.body.email).toEqual("kovacs.janos@example.com");
            });

            test("should return 404 when user not found", async () => 
            {
                const res = await request(app).get("/api/users/99999")
                .set("Accept", "application/json");

                expect(res.status).toBe(404);
            });
        });

        describe("PUT /:id", () => 
        {
            test("should update a user", async () => 
            {
                const updateData = { keresztnev: "Jánosné" };
                const userId = createdUsers[0].id;
                const res = await request(app).put(`/api/users/${userId}`).send(updateData);

                expect(res.status).toBe(200);
                expect(res.type).toMatch(/json/);
                expect(res.body.keresztnev).toEqual("Jánosné");
            });

            test("should return 400 when vezeteknev contains numbers", async () => 
            {
                const updateData = { vezeteknev: "Kovács123" };
                const userId = createdUsers[0].id;
                const res = await request(app).put(`/api/users/${userId}`).send(updateData);

                expect(res.status).toBe(400);
            });
        });

        describe("DELETE /:id", () => 
        {
            test("should delete user", async () => 
            {
                const userId = createdUsers[1].id;
                const res = await request(app).delete(`/api/users/${userId}`);

                const foundUser = await db.User.findOne({ where: { id: userId } });

                expect(res.status).toBe(200);
                expect(res.type).toMatch(/json/);
                expect(foundUser).toBeNull();
            });
        });
    });
});

