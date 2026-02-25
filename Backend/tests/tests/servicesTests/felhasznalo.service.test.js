const { BadRequestError } = require("../../../api/errors");
const db = require("../../../api/db");
const { userService } = require("../../../api/services")(db);

describe("FelhasznaloService tests", () => {
    beforeAll(async () => {
        await db.sequelize.sync();
    });

    const users = [
        { 
            vezeteknev: "Kovács", 
            keresztnev: "János", 
            email: "kovacs.janos@example.com",
            telefonszam: "0612345678",
            jelszo: "password123"
        },  
        { 
            vezeteknev: "Nagy", 
            keresztnev: "Mária", 
            email: "nagy.maria@example.com",
            telefonszam: "0623456789",
            jelszo: "password123"
        }
    ];

    let createdUsers;

    beforeEach(async () => {
        await db.Felhasznalo.destroy({ where: {} });
        createdUsers = await db.Felhasznalo.bulkCreate(users);
    });

    test("getUser should return all users", async () => {
        const result = await userService.getUser();
        expect(result.length).toBeGreaterThanOrEqual(users.length);
    });

    test("getUserById should return correct user", async () => {
        const user = await userService.getUserById(createdUsers[0].id);
        expect(user.email).toBe(users[0].email);
    });

    test("createUser should create a new user", async () => {
        const newUser = { 
            vezeteknev: "Tóth", 
            keresztnev: "Anna", 
            email: "toth.anna@example.com",
            telefonszam: "0645678901",
            jelszo: "password123"
        };
        const result = await userService.createUser(newUser);
        expect(result.email).toBe(newUser.email);
    });

    test("createUser should throw BadRequestError for invalid email", async () => {
        const invalidUser = { ...users[0], email: "invalid" };
        await expect(userService.createUser(invalidUser)).rejects.toThrow(BadRequestError);
    });

    test("updateUser should update user data", async () => {
        const updateData = { keresztnev: "Jánosné" };
        const result = await userService.updateUser(createdUsers[0].id, updateData);
        expect(result.keresztnev).toBe("Jánosné");
    });

    test("deleteUser should remove user", async () => {
        const result = await userService.deleteUser(createdUsers[0].id);
        expect(result).toBe(true);
        const found = await db.Felhasznalo.findByPk(createdUsers[0].id);
        expect(found).toBeNull();
    });
});
