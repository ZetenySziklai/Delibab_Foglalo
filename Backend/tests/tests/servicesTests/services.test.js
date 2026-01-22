const { BadRequestError } = require("../api/errors");

const { foglaloService } = require("../api/services")({});

describe("Service tests", () => 
{
    describe("FoglaloService", () => 
    {
        beforeAll(() => 
        {
            foglaloService.foglaloRepository.getFoglalo = jest.fn().mockReturnValue(true);
            foglaloService.foglaloRepository.createFoglalo = jest.fn().mockReturnValue(true);
            foglaloService.foglaloRepository.getFoglaloByEmail = jest.fn().mockReturnValue([]);
            foglaloService.foglaloRepository.getFoglaloByPhone = jest.fn().mockReturnValue([]);
        });

        describe("getFoglalo", () => 
        {
            test("should return all the foglalok", async () => 
            {
                const result = await foglaloService.getFoglalo();

                expect(result).toBeTruthy();
            });
        });

        describe("createFoglalo", () => 
        {
            test("should create a new foglalo", async () => 
            {
                const foglaloData =
                {
                    vezeteknev: "Kovács",
                    keresztnev: "János",
                    email: "kovacs.janos@example.com",
                    telefonszam: "0612345678",
                    megjegyzes: "Test megjegyzés"
                };

                const result = await foglaloService.createFoglalo(foglaloData);

                expect(result).toBeTruthy();
            });

            test("should throw BadRequestError given that there is no data", async () => 
            {
                await expect(foglaloService.createFoglalo(null)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError given that required fields are missing", async () => 
            {
                const foglalo = 
                {
                    vezeteknev: "Kovács",
                    // keresztnev hiányzik
                    email: "kovacs@example.com",
                    telefonszam: "0612345678"
                };

                await expect(foglaloService.createFoglalo(foglalo)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when vezeteknev contains numbers", async () => 
            {
                const foglalo = 
                {
                    vezeteknev: "Kovács123",
                    keresztnev: "János",
                    email: "kovacs@example.com",
                    telefonszam: "0612345678",
                    megjegyzes: "Test"
                };

                await expect(foglaloService.createFoglalo(foglalo)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when keresztnev contains numbers", async () => 
            {
                const foglalo = 
                {
                    vezeteknev: "Kovács",
                    keresztnev: "János456",
                    email: "kovacs@example.com",
                    telefonszam: "0612345678",
                    megjegyzes: "Test"
                };

                await expect(foglaloService.createFoglalo(foglalo)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when email is invalid", async () => 
            {
                const foglalo = 
                {
                    vezeteknev: "Kovács",
                    keresztnev: "János",
                    email: "invalid-email",
                    telefonszam: "0612345678",
                    megjegyzes: "Test"
                };

                await expect(foglaloService.createFoglalo(foglalo)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when phone number is invalid", async () => 
            {
                const foglalo = 
                {
                    vezeteknev: "Kovács",
                    keresztnev: "János",
                    email: "kovacs@example.com",
                    telefonszam: "123",
                    megjegyzes: "Test"
                };

                await expect(foglaloService.createFoglalo(foglalo)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when foglalo already exists with same email", async () => 
            {
                foglaloService.foglaloRepository.getFoglaloByEmail = jest.fn().mockReturnValue([{ foglalo_id: 1 }]);

                const foglalo = 
                {
                    vezeteknev: "Kovács",
                    keresztnev: "János",
                    email: "kovacs@example.com",
                    telefonszam: "0612345678",
                    megjegyzes: "Test"
                };

                await expect(foglaloService.createFoglalo(foglalo)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when foglalo already exists with same phone", async () => 
            {
                foglaloService.foglaloRepository.getFoglaloByEmail = jest.fn().mockReturnValue([]);
                foglaloService.foglaloRepository.getFoglaloByPhone = jest.fn().mockReturnValue([{ foglalo_id: 1 }]);

                const foglalo = 
                {
                    vezeteknev: "Kovács",
                    keresztnev: "János",
                    email: "kovacs@example.com",
                    telefonszam: "0612345678",
                    megjegyzes: "Test"
                };

                await expect(foglaloService.createFoglalo(foglalo)).rejects.toThrow(BadRequestError);
            });

            test("should accept valid magyar ékezetes characters in names", async () => 
            {
                foglaloService.foglaloRepository.getFoglaloByEmail = jest.fn().mockReturnValue([]);
                foglaloService.foglaloRepository.getFoglaloByPhone = jest.fn().mockReturnValue([]);

                const foglalo = 
                {
                    vezeteknev: "Kovács",
                    keresztnev: "Ágnes",
                    email: "kovacs.agnes@example.com",
                    telefonszam: "0612345678",
                    megjegyzes: "Test"
                };

                const result = await foglaloService.createFoglalo(foglalo);
                expect(result).toBeTruthy();
            });
        });

        describe("getFoglaloByEmail", () => 
        {
            test("should throw BadRequestError when email is invalid", async () => 
            {
                await expect(foglaloService.getFoglaloByEmail("invalid-email")).rejects.toThrow(BadRequestError);
            });

            test("should return foglalo when email is valid", async () => 
            {
                foglaloService.foglaloRepository.getFoglaloByEmail = jest.fn().mockReturnValue([{ foglalo_id: 1 }]);

                const result = await foglaloService.getFoglaloByEmail("test@example.com");
                expect(result).toBeTruthy();
            });
        });

        describe("updateFoglalo", () => 
        {
            test("should throw BadRequestError when vezeteknev contains numbers", async () => 
            {
                foglaloService.foglaloRepository.getFoglaloByEmail = jest.fn().mockReturnValue([]);

                const data = 
                {
                    vezeteknev: "Kovács123"
                };

                await expect(foglaloService.updateFoglalo(1, data)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when email already exists for another foglalo", async () => 
            {
                foglaloService.foglaloRepository.getFoglaloByEmail = jest.fn().mockReturnValue([{ foglalo_id: 2 }]);
                foglaloService.foglaloRepository.updateFoglalo = jest.fn().mockReturnValue(true);

                const data = 
                {
                    email: "existing@example.com"
                };

                await expect(foglaloService.updateFoglalo(1, data)).rejects.toThrow(BadRequestError);
            });
        });

        describe("getFoglalokByDateRange", () => 
        {
            test("should throw BadRequestError when startDate or endDate is missing", async () => 
            {
                await expect(foglaloService.getFoglalokByDateRange(null, "2024-01-01")).rejects.toThrow(BadRequestError);
                await expect(foglaloService.getFoglalokByDateRange("2024-01-01", null)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when startDate is after endDate", async () => 
            {
                await expect(foglaloService.getFoglalokByDateRange("2024-12-31", "2024-01-01")).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when dates are invalid", async () => 
            {
                await expect(foglaloService.getFoglalokByDateRange("invalid", "2024-01-01")).rejects.toThrow(BadRequestError);
            });
        });
    });
});

