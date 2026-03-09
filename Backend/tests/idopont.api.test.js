require("dotenv").config({ quiet: true, path: "./.env.test" });

const request = require("supertest");
const app = require("../app");
const db = require("../api/db");

describe("/api/idopontok", () =>
{
    beforeAll(async () =>
    {
        await db.sequelize.sync();
    });

    afterAll(async () =>
    {
        await db.sequelize.close();
    });

    const idopontokData =
    [
        { kezdet: 8,  veg: 10 },
        { kezdet: 12, veg: 14 },
        { kezdet: 18, veg: 20 },
    ];

    let createdIdopontok;

    beforeEach(async () =>
    {
        await db.Idopont.destroy({ where: {} });
        createdIdopontok = await db.Idopont.bulkCreate(idopontokData);
    });

    afterEach(async () =>
    {
        await db.Idopont.destroy({ where: {} });
    });

    // ── GET /api/idopontok ──────────────────────────────────────────────────
    describe("GET /api/idopontok", () =>
    {
        test("should return all time slots with status 200", async () =>
        {
            const res = await request(app)
                .get("/api/idopontok")
                .set("Accept", "application/json");

            expect(res.status).toBe(200);
            expect(res.get("Content-Type")).toMatch(/json/);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(idopontokData.length);
        });
    });

    // ── GET /api/idopontok/:id ──────────────────────────────────────────────
    describe("GET /api/idopontok/:id", () =>
    {
        test.each([0, 1, 2])("should return the correct time slot by id #%#", async (index) =>
        {
            const idopontId = createdIdopontok[index].id;

            const res = await request(app).get(`/api/idopontok/${idopontId}`);

            expect(res.status).toBe(200);
            expect(res.body).toBeDefined();
            expect(res.body.id).toEqual(idopontId);
            expect(res.body.kezdet).toEqual(idopontokData[index].kezdet);
            expect(res.body.veg).toEqual(idopontokData[index].veg);
        });

        test("should return 404 when time slot is not found", async () =>
        {
            const res = await request(app).get("/api/idopontok/999999");

            expect(res.status).toBe(404);
        });
    });

    // ── POST /api/idopontok ─────────────────────────────────────────────────
    describe("POST /api/idopontok", () =>
    {
        test("should create a new time slot", async () =>
        {
            // Arrange
            const newIdopont = { kezdet: 16, veg: 18 };

            // Act
            const res = await request(app).post("/api/idopontok").send(newIdopont);

            // Assert
            expect(res.status).toBe(201);
            expect(res.body.id).toBeDefined();
            expect(res.body.id).not.toBeNull();
            expect(res.body.kezdet).toEqual(newIdopont.kezdet);
            expect(res.body.veg).toEqual(newIdopont.veg);
        });

        test("should return 400 when kezdet is missing", async () =>
        {
            const res = await request(app)
                .post("/api/idopontok")
                .send({ veg: 10 });

            expect(res.status).toBe(400);
        });

        test("should return 400 when veg is missing", async () =>
        {
            const res = await request(app)
                .post("/api/idopontok")
                .send({ kezdet: 8 });

            expect(res.status).toBe(400);
        });

        test("should return 400 when kezdet >= veg", async () =>
        {
            const res = await request(app)
                .post("/api/idopontok")
                .send({ kezdet: 14, veg: 10 });

            expect(res.status).toBe(400);
        });

        test("should return 400 when kezdet equals veg", async () =>
        {
            const res = await request(app)
                .post("/api/idopontok")
                .send({ kezdet: 10, veg: 10 });

            expect(res.status).toBe(400);
        });

        test("should return 400 when kezdet is negative", async () =>
        {
            const res = await request(app)
                .post("/api/idopontok")
                .send({ kezdet: -1, veg: 10 });

            expect(res.status).toBe(400);
        });
    });

    // ── PUT /api/idopontok/:id ──────────────────────────────────────────────
    describe("PUT /api/idopontok/:id", () =>
    {
        test.each(
        [
            { index: 0, updateData: { kezdet: 9,  veg: 11 } },
            { index: 1, updateData: { veg: 16 } },
            { index: 2, updateData: { kezdet: 19, veg: 21 } },
        ])
        ("should update the time slot #%#", async ({ index, updateData }) =>
        {
            const idopontId = createdIdopontok[index].id;

            const res = await request(app)
                .put(`/api/idopontok/${idopontId}`)
                .send(updateData);

            expect(res.status).toBe(200);
            for (const key of Object.keys(updateData))
            {
                expect(res.body[key]).toEqual(updateData[key]);
            }
        });

        test("should return 400 when kezdet >= veg after update", async () =>
        {
            const idopontId = createdIdopontok[0].id;

            const res = await request(app)
                .put(`/api/idopontok/${idopontId}`)
                .send({ kezdet: 20, veg: 10 });

            expect(res.status).toBe(400);
        });

        test("should return 404 when time slot is not found", async () =>
        {
            const res = await request(app)
                .put("/api/idopontok/999999")
                .send({ kezdet: 9, veg: 11 });

            expect(res.status).toBe(404);
        });
    });

    // ── DELETE /api/idopontok/:id ───────────────────────────────────────────
    describe("DELETE /api/idopontok/:id", () =>
    {
        test.each([0, 1, 2])("should delete the time slot #%#", async (index) =>
        {
            const idopontId = createdIdopontok[index].id;

            const res = await request(app).delete(`/api/idopontok/${idopontId}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBeDefined();

            const found = await db.Idopont.findByPk(idopontId);
            expect(found).toBeNull();
        });

        test("should return 404 when time slot does not exist", async () =>
        {
            const res = await request(app).delete("/api/idopontok/999999");

            expect(res.status).toBe(404);
        });
    });
});