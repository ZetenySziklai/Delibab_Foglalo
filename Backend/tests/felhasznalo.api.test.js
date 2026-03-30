require("dotenv").config({ quiet: true, path: "./.env.test" });

const request = require("supertest");
const app = require("../app");
const db = require("../api/db");

describe("/api/users", () =>
{
    beforeAll(async () =>
    {
        await db.sequelize.sync();
    });

    afterAll(async () =>
    {
        await db.sequelize.close();
    });

    const usersData =
    [
        {
            vezeteknev: "Kovács",
            keresztnev: "János",
            email: "kovacs.janos@example.com",
            telefonszam: "0612345678",
            jelszo: "pass123",
        },
        {
            vezeteknev: "Nagy",
            keresztnev: "Mária",
            email: "nagy.maria@example.com",
            telefonszam: "0623456789",
            jelszo: "pass123",
        },
    ];

    let createdUsers;

    beforeEach(async () =>
    {
        await db.Felhasznalo.destroy({ where: {} });
        createdUsers = await db.Felhasznalo.bulkCreate(usersData);
    });

    afterEach(async () =>
    {
        await db.Felhasznalo.destroy({ where: {} });
    });

    describe("GET /api/users", () =>
    {
        test("should return all users with status 200", async () =>
        {
            const res = await request(app)
                .get("/api/users")
                .set("Accept", "application/json");

            expect(res.status).toBe(200);
            expect(res.get("Content-Type")).toMatch(/json/);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(usersData.length);
        });
    });

    describe("GET /api/users/:id", () =>
    {
        test.each([0, 1])("should return the correct user's data #%#", async (index) =>
        {
            const user = usersData[index];
            const userId = createdUsers[index].id;

            const res = await request(app).get(`/api/users/${userId}`);

            expect(res.status).toBe(200);
            expect(res.body).toBeDefined();
            expect(res.body.email).toEqual(user.email);
            expect(res.body.vezeteknev).toEqual(user.vezeteknev);
            expect(res.body.keresztnev).toEqual(user.keresztnev);
            expect(res.body.telefonszam).toEqual(user.telefonszam);
        });

        test("should return 404 when user is not found", async () =>
        {
            const res = await request(app).get("/api/users/999999");

            expect(res.status).toBe(404);
        });
    });

    describe("POST /api/users", () =>
    {
        test("should create a new user", async () =>
        {
            const newUser =
            {
                vezeteknev: "Tóth",
                keresztnev: "Anna",
                email: "toth.anna@example.com",
                telefonszam: "0645678901",
                jelszo: "pass123",
            };

            const res = await request(app).post("/api/users").send(newUser);

            expect(res.status).toBe(201);
            expect(res.body.id).toBeDefined();
            expect(res.body.id).not.toBeNull();
            expect(res.body.vezeteknev).toEqual(newUser.vezeteknev);
            expect(res.body.keresztnev).toEqual(newUser.keresztnev);
            expect(res.body.email).toEqual(newUser.email);
        });

        test("should return 400 when required fields are missing", async () =>
        {
            const res = await request(app)
                .post("/api/users")
                .send({ vezeteknev: "Tóth" });

            expect(res.status).toBe(400);
        });

        test("should return 400 for invalid email format", async () =>
        {
            const res = await request(app).post("/api/users").send(
            {
                vezeteknev: "Tóth",
                keresztnev: "Anna",
                email: "invalid-email",
                telefonszam: "0645678901",
                jelszo: "pass123",
            });

            expect(res.status).toBe(400);
        });

        test("should return 400 when email is already taken", async () =>
        {
            const res = await request(app).post("/api/users").send(
            {
                ...usersData[0],
                telefonszam: "0699999999",
            });

            expect(res.status).toBe(400);
        });
    });

    describe("PUT /api/users/:id", () =>
    {
        test.each(
        [
            { index: 0, updateData: { keresztnev: "Jánosné" } },
            { index: 1, updateData: { vezeteknev: "Kiss" } },
            { index: 0, updateData: { keresztnev: "Béla", vezeteknev: "Fekete" } },
        ])
        ("should update the specified user's data #%#", async ({ index, updateData }) =>
        {
            const userId = createdUsers[index].id;

            const res = await request(app)
                .put(`/api/users/${userId}`)
                .send(updateData);

            expect(res.status).toBe(200);
            for (const key of Object.keys(updateData))
            {
                expect(res.body[key]).toEqual(updateData[key]);
            }
        });

        test("should return 404 when user is not found", async () =>
        {
            const res = await request(app)
                .put("/api/users/999999")
                .send({ keresztnev: "Nem" });

            expect(res.status).toBe(404);
        });
    });

    describe("DELETE /api/users/:id", () =>
    {
        test.each([0, 1])("should delete the user #%#", async (index) =>
        {
            const userId = createdUsers[index].id;

            const res = await request(app).delete(`/api/users/${userId}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBeDefined();

            const found = await db.Felhasznalo.findByPk(userId);
            expect(found).toBeNull();
        });

        test("should return 404 when user does not exist", async () =>
        {
            const res = await request(app).delete("/api/users/999999");

            expect(res.status).toBe(404);
        });
    });
});