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
                telefonszam: "0612345678",
                jelszo: "pass"
            },  
            { 
                vezeteknev: "Nagy", 
                keresztnev: "Mária", 
                email: "nagy.maria@example.com",
                telefonszam: "0623456789",
                jelszo: "pass"
            },  
            { 
                vezeteknev: "Szabó", 
                keresztnev: "Péter", 
                email: "szabo.peter@example.com",
                telefonszam: "0634567890",
                jelszo: "pass"
            },  
        ];

        let createdUsers;

        beforeEach(async () => 
        {
            await db.Felhasznalo.destroy({ where: {} });
            createdUsers = await db.Felhasznalo.bulkCreate(users);
        });

        afterEach(async () => 
        {
            await db.Felhasznalo.destroy({ where: {} });
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
                    telefonszam: "0645678901",
                    jelszo: "pass"
                };

                const res = await request(app).post("/api/users").send(user);

                expect(res.status).toBe(201);
                expect(res.body.vezeteknev).toEqual(user.vezeteknev);

                const foundUser = await db.Felhasznalo.findOne({ where: { email: "toth.anna@example.com" } });
                expect(foundUser).toBeDefined();
            });

            test("should return 400 when required fields are missing", async () => 
            {
                const res = await request(app).post("/api/users").send({ vezeteknev: "Tóth" });
                expect(res.status).toBe(400);
            });
        });

        describe("GET /:id", () => 
        {
            test("should return user by id", async () => 
            {
                const userId = createdUsers[0].id;
                const res = await request(app).get(`/api/users/${userId}`);
                expect(res.status).toBe(200);
                expect(res.body.email).toEqual("kovacs.janos@example.com");
            });
        });

        describe("DELETE /:id", () => 
        {
            test("should delete user", async () => 
                {
                const userId = createdUsers[1].id;
                const res = await request(app).delete(`/api/users/${userId}`);
                const foundUser = await db.Felhasznalo.findOne({ where: { id: userId } });
                expect(res.status).toBe(200);
                expect(foundUser).toBeNull();
            });
        });
    });
});
