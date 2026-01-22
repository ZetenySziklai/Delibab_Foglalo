const request = require("supertest");

const app = require("../app");

const db = require("../api/db");

describe("API Tests", () => 
{
    beforeAll(async () => 
    {
        await db.sequelize.sync();
    });

    describe("/api/foglalok", () => 
    {
        const foglalok = 
        [
            { 
                vezeteknev: "Kovács", 
                keresztnev: "János", 
                email: "kovacs.janos@example.com",
                telefonszam: "0612345678",
                megjegyzes: "Test megjegyzés 1"
            },  
            { 
                vezeteknev: "Nagy", 
                keresztnev: "Mária", 
                email: "nagy.maria@example.com",
                telefonszam: "0623456789",
                megjegyzes: "Test megjegyzés 2"
            },  
            { 
                vezeteknev: "Szabó", 
                keresztnev: "Péter", 
                email: "szabo.peter@example.com",
                telefonszam: "0634567890",
                megjegyzes: "Test megjegyzés 3"
            },  
        ];

        let createdFoglalok;

        beforeEach(async () => 
        {
            // Töröljük az összes adatot, hogy tiszta legyen az adatbázis
            await db.Foglalo.destroy({ where: {} });
            // Létrehozzuk a foglalókat és eltároljuk az ID-kat
            createdFoglalok = await db.Foglalo.bulkCreate(foglalok);
        });

        afterEach(async () => 
        {
            await db.Foglalo.destroy({ where: {} });
        });

        describe("GET", () => 
        {
            test("should return all the foglalok", async () => 
            {
                const res = await request(app).get("/api/foglalok")
                .set("Accept", "application/json");

                expect(res.status).toBe(200);

                expect(res.type).toMatch(/json/);

                expect(res.body.length).toBeGreaterThanOrEqual(foglalok.length);
            });
        });

        describe("POST", () => 
        {
            test("should create a foglalo", async () => 
            {
                // AAA
                
                //#region Arrange

                const foglalo = { 
                    vezeteknev: "Tóth", 
                    keresztnev: "Anna", 
                    email: "toth.anna@example.com",
                    telefonszam: "0645678901",
                    megjegyzes: "Test megjegyzés 4"
                };
                
                //#endregion

                //#region Act

                const res = await request(app).post("/api/foglalok").send(foglalo);

                //#endregion

                //#region Assert

                expect(res.status).toBe(201);
                expect(res.type).toMatch(/json/);
                expect(res.body.vezeteknev).toEqual(foglalo.vezeteknev);
                expect(res.body.keresztnev).toEqual(foglalo.keresztnev);
                expect(res.body.email).toEqual(foglalo.email);

                const foundFoglalo = await db.Foglalo.findOne(
                {
                    where:
                    {
                        email: "toth.anna@example.com",
                    }
                });

                expect(foundFoglalo).toBeDefined();
                expect(foundFoglalo.vezeteknev).toEqual("Tóth");
                expect(foundFoglalo.keresztnev).toEqual("Anna");

                //#endregion

            });

            test("should return 400 when required fields are missing", async () => 
            {
                const foglalo = { 
                    vezeteknev: "Tóth",
                    // keresztnev hiányzik
                    email: "toth@example.com",
                    telefonszam: "0645678901"
                };

                const res = await request(app).post("/api/foglalok").send(foglalo);

                expect(res.status).toBe(400);
            });

            test("should return 400 when vezeteknev contains numbers", async () => 
            {
                const foglalo = { 
                    vezeteknev: "Tóth123", 
                    keresztnev: "Anna", 
                    email: "toth@example.com",
                    telefonszam: "0645678901",
                    megjegyzes: "Test"
                };

                const res = await request(app).post("/api/foglalok").send(foglalo);

                expect(res.status).toBe(400);
            });

            test("should return 400 when email is invalid", async () => 
            {
                const foglalo = { 
                    vezeteknev: "Tóth", 
                    keresztnev: "Anna", 
                    email: "invalid-email",
                    telefonszam: "0645678901",
                    megjegyzes: "Test"
                };

                const res = await request(app).post("/api/foglalok").send(foglalo);

                expect(res.status).toBe(400);
            });
        });

        describe("GET /email/:email", () => 
        {
            test("should return foglalo by email", async () => 
            {
                const res = await request(app).get("/api/foglalok/email/kovacs.janos@example.com")
                .set("Accept", "application/json");

                expect(res.status).toBe(200);
                expect(res.type).toMatch(/json/);
                expect(res.body.length).toBeGreaterThan(0);
                expect(res.body[0].email).toEqual("kovacs.janos@example.com");
            });

            test("should return 404 when email not found", async () => 
            {
                const res = await request(app).get("/api/foglalok/email/nonexistent@example.com")
                .set("Accept", "application/json");

                expect(res.status).toBe(404);
            });
        });

        describe("PUT /:id", () => 
        {
            test("should update a foglalo", async () => 
            {
                const updateData = {
                    keresztnev: "Jánosné"
                };

                // Használjuk az első létrehozott foglaló ID-ját
                const foglaloId = createdFoglalok[0].foglalo_id;
                const res = await request(app).put(`/api/foglalok/${foglaloId}`).send(updateData);

                expect(res.status).toBe(200);
                expect(res.type).toMatch(/json/);
                expect(res.body.keresztnev).toEqual("Jánosné");
            });

            test("should return 400 when vezeteknev contains numbers", async () => 
            {
                const updateData = {
                    vezeteknev: "Kovács123"
                };

                // Használjuk az első létrehozott foglaló ID-ját
                const foglaloId = createdFoglalok[0].foglalo_id;
                const res = await request(app).put(`/api/foglalok/${foglaloId}`).send(updateData);

                expect(res.status).toBe(400);
            });
        });

        describe("DELETE /:id", () => 
        {
            test("should delete foglalo", async () => 
            {
                // Használjuk a második létrehozott foglaló ID-ját
                const foglaloId = createdFoglalok[1].foglalo_id;
                const res = await request(app).delete(`/api/foglalok/${foglaloId}`);

                const foundFoglalo = await db.Foglalo.findOne(
                {
                    where:
                    {
                        foglalo_id: foglaloId,
                    }
                });

                expect(res.status).toBe(200);
                expect(res.type).toMatch(/json/);

                expect(foundFoglalo).toBeNull();
            });
        });
    });
});

