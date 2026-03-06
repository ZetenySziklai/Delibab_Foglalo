require("dotenv").config({ quiet: true, path: "./.env.test" });

const request = require("supertest");
const app = require("../../app");
const db = require("../../api/db");

describe("/api/foglalasok", () =>
{
    beforeAll(async () =>
    {
        await db.sequelize.sync();
    });

    afterAll(async () =>
    {
        await db.sequelize.close();
    });

    let user, asztal, createdFoglalasok;

    beforeEach(async () =>
    {
        await db.Foglalas.destroy({ where: {} });
        await db.Felhasznalo.destroy({ where: {} });
        await db.Asztal.destroy({ where: {} });

        user = await db.Felhasznalo.create(
        {
            vezeteknev: "Teszt",
            keresztnev: "Elek",
            email: "teszt.elek@example.com",
            telefonszam: "0611111111",
            jelszo: "pass123",
        });

        asztal = await db.Asztal.create({ helyek_szama: 4 });

        createdFoglalasok = await db.Foglalas.bulkCreate(
        [
            {
                user_id: user.id,
                asztal_id: asztal.id,
                foglalas_datum: "2026-12-01 10:00:00",
            },
            {
                user_id: user.id,
                asztal_id: asztal.id,
                foglalas_datum: "2026-12-02 14:00:00",
            },
        ]);
    });

    afterEach(async () =>
    {
        await db.Foglalas.destroy({ where: {} });
        await db.Felhasznalo.destroy({ where: {} });
        await db.Asztal.destroy({ where: {} });
    });

    // ── GET /api/foglalasok ─────────────────────────────────────────────────
    describe("GET /api/foglalasok", () =>
    {
        test("should return all bookings with status 200", async () =>
        {
            const res = await request(app)
                .get("/api/foglalasok")
                .set("Accept", "application/json");

            expect(res.status).toBe(200);
            expect(res.get("Content-Type")).toMatch(/json/);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
        });
    });

    // ── GET /api/foglalasok/:id ─────────────────────────────────────────────
    describe("GET /api/foglalasok/:id", () =>
    {
        test.each([0, 1])("should return the correct booking by id #%#", async (index) =>
        {
            const foglalasId = createdFoglalasok[index].id;

            const res = await request(app).get(`/api/foglalasok/${foglalasId}`);

            expect(res.status).toBe(200);
            expect(res.body).toBeDefined();
            expect(res.body.id).toEqual(foglalasId);
            expect(res.body.user_id).toEqual(user.id);
            expect(res.body.asztal_id).toEqual(asztal.id);
        });

        test("should return 404 when booking is not found", async () =>
        {
            const res = await request(app).get("/api/foglalasok/999999");

            expect(res.status).toBe(404);
        });
    });

    // ── POST /api/foglalasok ────────────────────────────────────────────────
    describe("POST /api/foglalasok", () =>
    {
        test("should create a new booking", async () =>
        {
            // Arrange
            const newFoglalas =
            {
                user_id: user.id,
                asztal_id: asztal.id,
                foglalas_datum: "2026-12-05 18:00:00",
            };

            // Act
            const res = await request(app).post("/api/foglalasok").send(newFoglalas);

            // Assert
            expect(res.status).toBe(201);
            expect(res.body.user_id).toEqual(user.id);
            expect(res.body.asztal_id).toEqual(asztal.id);
        });

        test("should return 400 when required fields are missing", async () =>
        {
            const res = await request(app)
                .post("/api/foglalasok")
                .send({ user_id: user.id });

            expect(res.status).toBe(400);
        });

        test("should return 404 when user does not exist", async () =>
        {
            const res = await request(app).post("/api/foglalasok").send(
            {
                user_id: 999999,
                asztal_id: asztal.id,
                foglalas_datum: "2026-12-10 18:00:00",
            });

            expect(res.status).toBe(404);
        });

        test("should return 404 when table does not exist", async () =>
        {
            const res = await request(app).post("/api/foglalasok").send(
            {
                user_id: user.id,
                asztal_id: 999999,
                foglalas_datum: "2026-12-10 18:00:00",
            });

            expect(res.status).toBe(404);
        });

        test("should return 400 when table is already booked at the same time", async () =>
        {
            const res = await request(app).post("/api/foglalasok").send(
            {
                user_id: user.id,
                asztal_id: asztal.id,
                foglalas_datum: "2026-12-01 10:30:00",
            });

            expect(res.status).toBe(400);
        });
    });

    // ── PUT /api/foglalasok/:id ─────────────────────────────────────────────
    describe("PUT /api/foglalasok/:id", () =>
    {
        test.each(
        [
            { index: 0, updateData: { foglalas_datum: "2026-12-20 09:00:00" } },
            { index: 1, updateData: { foglalas_datum: "2026-12-21 15:00:00" } },
        ])
        ("should update the booking #%#", async ({ index, updateData }) =>
        {
            const foglalasId = createdFoglalasok[index].id;

            const res = await request(app)
                .put(`/api/foglalasok/${foglalasId}`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.id).toEqual(foglalasId);
        });

        test("should return 404 when booking is not found", async () =>
        {
            const res = await request(app)
                .put("/api/foglalasok/999999")
                .send({ foglalas_datum: "2026-12-15 09:00:00" });

            expect(res.status).toBe(404);
        });
    });

    // ── DELETE /api/foglalasok/:id ──────────────────────────────────────────
    describe("DELETE /api/foglalasok/:id", () =>
    {
        test.each([0, 1])("should delete the booking #%#", async (index) =>
        {
            const foglalasId = createdFoglalasok[index].id;

            const res = await request(app).delete(`/api/foglalasok/${foglalasId}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBeDefined();

            const found = await db.Foglalas.findByPk(foglalasId);
            expect(found).toBeNull();
        });

        test("should return 404 when booking does not exist", async () =>
        {
            const res = await request(app).delete("/api/foglalasok/999999");

            expect(res.status).toBe(404);
        });
    });

    // ── GET /api/foglalasok/foglalt-idopontok/list ──────────────────────────
    describe("GET /api/foglalasok/foglalt-idopontok/list", () =>
    {
        test("should return booked times for a given date and table", async () =>
        {
            const res = await request(app)
                .get("/api/foglalasok/foglalt-idopontok/list")
                .query({ datum: "2026-12-01", asztalId: asztal.id });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("datum", "2026-12-01");
            expect(res.body).toHaveProperty("asztal_id");
            expect(res.body).toHaveProperty("foglalt_idopontok");
            expect(Array.isArray(res.body.foglalt_idopontok)).toBe(true);
            expect(res.body.foglalt_idopontok.length).toBeGreaterThanOrEqual(1);
        });

        test("should return empty list for a date with no bookings", async () =>
        {
            const res = await request(app)
                .get("/api/foglalasok/foglalt-idopontok/list")
                .query({ datum: "2099-01-01", asztalId: asztal.id });

            expect(res.status).toBe(200);
            expect(res.body.foglalt_idopontok.length).toBe(0);
        });
    });

    // ── GET /api/foglalasok/datum/list ──────────────────────────────────────
    describe("GET /api/foglalasok/datum/list", () =>
    {
        test("should return bookings for a given date", async () =>
        {
            const res = await request(app)
                .get("/api/foglalasok/datum/list")
                .query({ datum: "2026-12-01" });

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });

        test("should return empty array when no bookings on date", async () =>
        {
            const res = await request(app)
                .get("/api/foglalasok/datum/list")
                .query({ datum: "2099-01-01" });

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0);
        });

        test("should return 400 when datum is missing", async () =>
        {
            const res = await request(app).get("/api/foglalasok/datum/list");

            expect(res.status).toBe(400);
        });
    });

    // ── GET /api/foglalasok/user/:userId ────────────────────────────────────
    describe("GET /api/foglalasok/user/:userId", () =>
    {
        test("should return bookings for a specific user", async () =>
        {
            const res = await request(app).get(`/api/foglalasok/user/${user.id}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
            res.body.forEach((foglalas) =>
            {
                expect(foglalas.user_id).toEqual(user.id);
            });
        });

        test("should return empty array for user with no bookings", async () =>
        {
            const otherUser = await db.Felhasznalo.create(
            {
                vezeteknev: "Üres",
                keresztnev: "Felhasználó",
                email: "ures@example.com",
                telefonszam: "0699999999",
                jelszo: "pass123",
            });

            const res = await request(app).get(`/api/foglalasok/user/${otherUser.id}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0);
        });
    });
});
