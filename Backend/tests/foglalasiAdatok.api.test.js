require("dotenv").config({ quiet: true, path: "./.env.test" });

const request = require("supertest");
const app = require("../app");
const db = require("../api/db");

describe("/api/foglalasi-adatok", () =>
{
    beforeAll(async () =>
    {
        await db.sequelize.sync();
    });

    afterAll(async () =>
    {
        await db.sequelize.close();
    });

    const foglalasiAdatokData =
    [
        { foglalas_datum: "2026-12-01", felnott: 2, gyerek: 1 },
        { foglalas_datum: "2026-12-02", felnott: 3, gyerek: 0 },
        { foglalas_datum: "2026-12-03", felnott: 1, gyerek: 2 },
    ];

    let createdAdatok;

    beforeEach(async () =>
    {
        await db.FoglalasiAdatok.destroy({ where: {} });
        createdAdatok = await db.FoglalasiAdatok.bulkCreate(foglalasiAdatokData);
    });

    afterEach(async () =>
    {
        await db.FoglalasiAdatok.destroy({ where: {} });
    });

    describe("GET /api/foglalasi-adatok", () =>
    {
        test("should return all booking details with status 200", async () =>
        {
            const res = await request(app)
                .get("/api/foglalasi-adatok")
                .set("Accept", "application/json");

            expect(res.status).toBe(200);
            expect(res.get("Content-Type")).toMatch(/json/);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(foglalasiAdatokData.length);
        });
    });

    describe("GET /api/foglalasi-adatok/:id", () =>
    {
        test.each([0, 1, 2])("should return the correct booking detail by id #%#", async (index) =>
        {
            const adatId = createdAdatok[index].id;

            const res = await request(app).get(`/api/foglalasi-adatok/${adatId}`);

            expect(res.status).toBe(200);
            expect(res.body).toBeDefined();
            expect(res.body.id).toEqual(adatId);
            expect(res.body.felnott).toEqual(foglalasiAdatokData[index].felnott);
            expect(res.body.gyerek).toEqual(foglalasiAdatokData[index].gyerek);
        });

        test("should return 404 when booking detail is not found", async () =>
        {
            const res = await request(app).get("/api/foglalasi-adatok/999999");

            expect(res.status).toBe(404);
        });
    });

    describe("POST /api/foglalasi-adatok", () =>
    {
        test("should create new booking details", async () =>
        {
            const newAdatok =
            {
                foglalas_datum: "2026-12-10",
                felnott: 4,
                gyerek: 2,
            };

            const res = await request(app)
                .post("/api/foglalasi-adatok")
                .send(newAdatok);

            expect(res.status).toBe(201);
            expect(res.body.id).toBeDefined();
            expect(res.body.id).not.toBeNull();
            expect(res.body.felnott).toEqual(newAdatok.felnott);
            expect(res.body.gyerek).toEqual(newAdatok.gyerek);
        });

        test("should return 500 when foglalas_datum is missing", async () =>
        {
            const res = await request(app)
                .post("/api/foglalasi-adatok")
                .send({ felnott: 2, gyerek: 0 });

            expect(res.status).toBe(500);
        });

        test("should return 400 when felnott is missing", async () =>
        {
            const res = await request(app)
                .post("/api/foglalasi-adatok")
                .send({ foglalas_datum: "2026-12-10", gyerek: 0 });

            expect(res.status).toBe(400);
        });

        test("should return 400 when felnott is negative", async () =>
        {
            const res = await request(app)
                .post("/api/foglalasi-adatok")
                .send({ foglalas_datum: "2026-12-10", felnott: -1, gyerek: 0 });

            expect(res.status).toBe(400);
        });

        test("should return 400 when gyerek is negative", async () =>
        {
            const res = await request(app)
                .post("/api/foglalasi-adatok")
                .send({ foglalas_datum: "2026-12-10", felnott: 2, gyerek: -1 });

            expect(res.status).toBe(400);
        });
    });

    describe("PUT /api/foglalasi-adatok/:id", () =>
    {
        test.each(
        [
            { index: 0, updateData: { felnott: 5 } },
            { index: 1, updateData: { gyerek: 3 } },
            { index: 2, updateData: { felnott: 1, gyerek: 1 } },
        ])
        ("should update the booking detail #%#", async ({ index, updateData }) =>
        {
            const adatId = createdAdatok[index].id;

            const res = await request(app)
                .put(`/api/foglalasi-adatok/${adatId}`)
                .send(updateData);

            expect(res.status).toBe(200);
            for (const key of Object.keys(updateData))
            {
                expect(res.body[key]).toEqual(updateData[key]);
            }
        });

        test("should return 400 when felnott is negative", async () =>
        {
            const adatId = createdAdatok[0].id;

            const res = await request(app)
                .put(`/api/foglalasi-adatok/${adatId}`)
                .send({ felnott: -3 });

            expect(res.status).toBe(400);
        });

        test("should return 400 when gyerek is negative", async () =>
        {
            const adatId = createdAdatok[0].id;

            const res = await request(app)
                .put(`/api/foglalasi-adatok/${adatId}`)
                .send({ gyerek: -5 });

            expect(res.status).toBe(400);
        });

        test("should return 404 when booking detail is not found", async () =>
        {
            const res = await request(app)
                .put("/api/foglalasi-adatok/999999")
                .send({ felnott: 2 });

            expect(res.status).toBe(404);
        });
    });

    describe("DELETE /api/foglalasi-adatok/:id", () =>
    {
        test.each([0, 1, 2])("should delete the booking detail #%#", async (index) =>
        {
            const adatId = createdAdatok[index].id;

            const res = await request(app).delete(`/api/foglalasi-adatok/${adatId}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBeDefined();

            const found = await db.FoglalasiAdatok.findByPk(adatId);
            expect(found).toBeNull();
        });

        test("should return 404 when booking detail does not exist", async () =>
        {
            const res = await request(app).delete("/api/foglalasi-adatok/999999");

            expect(res.status).toBe(404);
        });
    });
});