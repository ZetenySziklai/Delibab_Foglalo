require("dotenv").config({ quiet: true, path: "./.env.test" });

const request = require("supertest");
const app = require("../app");
const db = require("../api/db");

describe("/api/asztalok", () =>
{
    beforeAll(async () =>
    {
        await db.sequelize.sync();
    });

    afterAll(async () =>
    {
        await db.sequelize.close();
    });

    const asztalokData =
    [
        { helyek_szama: 2 },
        { helyek_szama: 4 },
        { helyek_szama: 6 },
    ];

    let createdAsztalok;

    beforeEach(async () =>
    {
        await db.Asztal.destroy({ where: {} });
        createdAsztalok = await db.Asztal.bulkCreate(asztalokData);
    });

    afterEach(async () =>
    {
        await db.Asztal.destroy({ where: {} });
    });

    describe("GET /api/asztalok", () =>
    {
        test("should return all tables with status 200", async () =>
        {
            const res = await request(app)
                .get("/api/asztalok")
                .set("Accept", "application/json");

            expect(res.status).toBe(200);
            expect(res.get("Content-Type")).toMatch(/json/);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(asztalokData.length);
        });
    });

    describe("GET /api/asztalok/:id", () =>
    {
        test.each([0, 1, 2])("should return the correct table by id #%#", async (index) =>
        {
            const asztalId = createdAsztalok[index].id;

            const res = await request(app).get(`/api/asztalok/${asztalId}`);

            expect(res.status).toBe(200);
            expect(res.body).toBeDefined();
            expect(res.body.id).toEqual(asztalId);
            expect(res.body.helyek_szama).toEqual(asztalokData[index].helyek_szama);
        });

        test("should return 404 when table is not found", async () =>
        {
            const res = await request(app).get("/api/asztalok/999999");

            expect(res.status).toBe(404);
        });
    });

    describe("POST /api/asztalok", () =>
    {
        test("should create a new table", async () =>
        {
            const newAsztal = { helyek_szama: 8 };

            const res = await request(app).post("/api/asztalok").send(newAsztal);

            expect(res.status).toBe(201);
            expect(res.body.id).toBeDefined();
            expect(res.body.id).not.toBeNull();
            expect(res.body.helyek_szama).toEqual(newAsztal.helyek_szama);
        });

        test("should return 400 when helyek_szama is missing", async () =>
        {
            const res = await request(app).post("/api/asztalok").send({});

            expect(res.status).toBe(400);
        });

        test("should return 400 when helyek_szama is not positive", async () =>
        {
            const res = await request(app)
                .post("/api/asztalok")
                .send({ helyek_szama: -1 });

            expect(res.status).toBe(400);
        });

        test("should return 400 when helyek_szama is zero", async () =>
        {
            const res = await request(app)
                .post("/api/asztalok")
                .send({ helyek_szama: 0 });

            expect(res.status).toBe(400);
        });
    });

    describe("PUT /api/asztalok/:id", () =>
    {
        test.each(
        [
            { index: 0, updateData: { helyek_szama: 10 } },
            { index: 1, updateData: { helyek_szama: 3 } },
            { index: 2, updateData: { helyek_szama: 12 } },
        ])
        ("should update the table #%#", async ({ index, updateData }) =>
        {
            const asztalId = createdAsztalok[index].id;

            const res = await request(app)
                .put(`/api/asztalok/${asztalId}`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.helyek_szama).toEqual(updateData.helyek_szama);
        });

        test("should return 404 when table is not found", async () =>
        {
            const res = await request(app)
                .put("/api/asztalok/999999")
                .send({ helyek_szama: 4 });

            expect(res.status).toBe(404);
        });
    });

    describe("DELETE /api/asztalok/:id", () =>
    {
        test.each([0, 1, 2])("should delete the table #%#", async (index) =>
        {
            const asztalId = createdAsztalok[index].id;

            const res = await request(app).delete(`/api/asztalok/${asztalId}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBeDefined();

            const found = await db.Asztal.findByPk(asztalId);
            expect(found).toBeNull();
        });

        test("should return 404 when table does not exist", async () =>
        {
            const res = await request(app).delete("/api/asztalok/999999");

            expect(res.status).toBe(404);
        });
    });

    describe("GET /api/asztalok/szabad/list", () =>
    {
        test("should return free tables for a given date and time", async () =>
        {
            const res = await request(app)
                .get("/api/asztalok/szabad/list")
                .query({ datum: "2026-12-01", idopont: "12:00" });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("datum", "2026-12-01");
            expect(res.body).toHaveProperty("idopont", "12:00");
            expect(res.body).toHaveProperty("szabad_asztalok");
            expect(Array.isArray(res.body.szabad_asztalok)).toBe(true);
        });

        test("should filter by helyek_szama when provided", async () =>
        {
            const res = await request(app)
                .get("/api/asztalok/szabad/list")
                .query({ datum: "2026-12-01", idopont: "12:00", helyekSzama: 4 });

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.szabad_asztalok)).toBe(true);
        });

        test("should return 400 when datum is missing", async () =>
        {
            const res = await request(app)
                .get("/api/asztalok/szabad/list")
                .query({ idopont: "12:00" });

            expect(res.status).toBe(400);
        });

        test("should return 400 when idopont is missing", async () =>
        {
            const res = await request(app)
                .get("/api/asztalok/szabad/list")
                .query({ datum: "2026-12-01" });

            expect(res.status).toBe(400);
        });
    });
});