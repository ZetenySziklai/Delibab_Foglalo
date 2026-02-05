const { BadRequestError } = require("../../../api/errors");

const db = require("../../../api/db");
const { userService } = require("../../../api/services")(db);

describe("Service tests", () => 
{
    describe("UserService", () => 
    {
        beforeAll(() => 
        {
            userService.userRepository.getUser = jest.fn().mockReturnValue(true);
            userService.userRepository.createUser = jest.fn().mockReturnValue(true);
            userService.userRepository.getUserByEmail = jest.fn().mockReturnValue([]);
            userService.userRepository.getUserByPhone = jest.fn().mockReturnValue([]);
        });

        describe("getUser", () => 
        {
            test("should return all the users", async () => 
            {
                const result = await userService.getUser();

                expect(result).toBeTruthy();
            });
        });

        describe("createUser", () => 
        {
            test("should create a new user", async () => 
            {
                const userData =
                {
                    vezeteknev: "Kovács",
                    keresztnev: "János",
                    email: "kovacs.janos@example.com",
                    telefonszam: "0612345678"
                };

                const result = await userService.createUser(userData);

                expect(result).toBeTruthy();
            });

            test("should throw BadRequestError given that there is no data", async () => 
            {
                await expect(userService.createUser(null)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError given that required fields are missing", async () => 
            {
                const user = 
                {
                    vezeteknev: "Kovács",
                    // keresztnev hiányzik
                    email: "kovacs@example.com",
                    telefonszam: "0612345678"
                };

                await expect(userService.createUser(user)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when vezeteknev contains numbers", async () => 
            {
                const user = 
                {
                    vezeteknev: "Kovács123",
                    keresztnev: "János",
                    email: "kovacs@example.com",
                    telefonszam: "0612345678"
                };

                await expect(userService.createUser(user)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when keresztnev contains numbers", async () => 
            {
                const user = 
                {
                    vezeteknev: "Kovács",
                    keresztnev: "János456",
                    email: "kovacs@example.com",
                    telefonszam: "0612345678"
                };

                await expect(userService.createUser(user)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when email is invalid", async () => 
            {
                const user = 
                {
                    vezeteknev: "Kovács",
                    keresztnev: "János",
                    email: "invalid-email",
                    telefonszam: "0612345678"
                };

                await expect(userService.createUser(user)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when phone number is invalid", async () => 
            {
                const user = 
                {
                    vezeteknev: "Kovács",
                    keresztnev: "János",
                    email: "kovacs@example.com",
                    telefonszam: "123"
                };

                await expect(userService.createUser(user)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when user already exists with same email", async () => 
            {
                userService.userRepository.getUserByEmail = jest.fn().mockReturnValue([{ id: 1 }]);

                const user = 
                {
                    vezeteknev: "Kovács",
                    keresztnev: "János",
                    email: "kovacs@example.com",
                    telefonszam: "0612345678"
                };

                await expect(userService.createUser(user)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when user already exists with same phone", async () => 
            {
                userService.userRepository.getUserByEmail = jest.fn().mockReturnValue([]);
                userService.userRepository.getUserByPhone = jest.fn().mockReturnValue([{ id: 1 }]);

                const user = 
                {
                    vezeteknev: "Kovács",
                    keresztnev: "János",
                    email: "kovacs@example.com",
                    telefonszam: "0612345678"
                };

                await expect(userService.createUser(user)).rejects.toThrow(BadRequestError);
            });

            test("should accept valid magyar ékezetes characters in names", async () => 
            {
                userService.userRepository.getUserByEmail = jest.fn().mockReturnValue([]);
                userService.userRepository.getUserByPhone = jest.fn().mockReturnValue([]);

                const user = 
                {
                    vezeteknev: "Kovács",
                    keresztnev: "Ágnes",
                    email: "kovacs.agnes@example.com",
                    telefonszam: "0612345678"
                };

                const result = await userService.createUser(user);
                expect(result).toBeTruthy();
            });
        });

        describe("getUserByEmail", () => 
        {
            test("should throw BadRequestError when email is invalid", async () => 
            {
                await expect(userService.getUserByEmail("invalid-email")).rejects.toThrow(BadRequestError);
            });

            test("should return user when email is valid", async () => 
            {
                userService.userRepository.getUserByEmail = jest.fn().mockReturnValue([{ id: 1 }]);

                const result = await userService.getUserByEmail("test@example.com");
                expect(result).toBeTruthy();
            });
        });

        describe("updateUser", () => 
        {
            test("should throw BadRequestError when vezeteknev contains numbers", async () => 
            {
                userService.userRepository.getUserByEmail = jest.fn().mockReturnValue([]);

                const data = 
                {
                    vezeteknev: "Kovács123"
                };

                await expect(userService.updateUser(1, data)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when email already exists for another user", async () => 
            {
                userService.userRepository.getUserByEmail = jest.fn().mockReturnValue([{ id: 2 }]);
                userService.userRepository.updateUser = jest.fn().mockReturnValue(true);

                const data = 
                {
                    email: "existing@example.com"
                };

                await expect(userService.updateUser(1, data)).rejects.toThrow(BadRequestError);
            });
        });

        describe("getUsersByDateRange", () => 
        {
            test("should throw BadRequestError when startDate or endDate is missing", async () => 
            {
                await expect(userService.getUsersByDateRange(null, "2024-01-01")).rejects.toThrow(BadRequestError);
                await expect(userService.getUsersByDateRange("2024-01-01", null)).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when startDate is after endDate", async () => 
            {
                await expect(userService.getUsersByDateRange("2024-12-31", "2024-01-01")).rejects.toThrow(BadRequestError);
            });

            test("should throw BadRequestError when dates are invalid", async () => 
            {
                await expect(userService.getUsersByDateRange("invalid", "2024-01-01")).rejects.toThrow(BadRequestError);
            });
        });
    });
});

