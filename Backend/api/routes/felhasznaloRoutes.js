const express = require("express")
const router = express.Router();
const userController = require("../controllers/FelhasznaloController");

/**
 * @swagger
 * tags:
 *   name: Felhasznalo
 *   description: Felhasználók kezelése
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Felhasznalo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         vezeteknev:
 *           type: string
 *         keresztnev:
 *           type: string
 *         email:
 *           type: string
 *         telefonszam:
 *           type: string
 *         regisztracio_datuma:
 *           type: string
 *           format: date-time
 *         isAdmin:
 *           type: boolean
 *       example:
 *         id: 1
 *         vezeteknev: "Kovács"
 *         keresztnev: "János"
 *         email: "kovacs.janos@email.hu"
 *         telefonszam: "06301234567"
 *         regisztracio_datuma: "2025-01-01T10:00:00.000Z"
 *         isAdmin: false
 *     CreateFelhasznalo:
 *       type: object
 *       required: [vezeteknev, keresztnev, email, telefonszam, jelszo]
 *       properties:
 *         vezeteknev:
 *           type: string
 *           description: "Csak betűket tartalmazhat (magyar ékezetes betűk is elfogadottak)"
 *         keresztnev:
 *           type: string
 *           description: "Csak betűket tartalmazhat (magyar ékezetes betűk is elfogadottak)"
 *         email:
 *           type: string
 *           description: "Érvényes email cím, pl. nev@example.com"
 *         telefonszam:
 *           type: string
 *           description: "Magyar formátum: +36301234567, 06301234567, 0036301234567. Szóköz, kötőjel, zárójel is elfogadott."
 *         jelszo:
 *           type: string
 *       example:
 *         vezeteknev: "Kovács"
 *         keresztnev: "János"
 *         email: "kovacs.janos@email.hu"
 *         telefonszam: "06301234567"
 *         jelszo: "titkosJelszo"
 *     UpdateFelhasznalo:
 *       type: object
 *       properties:
 *         vezeteknev:
 *           type: string
 *         keresztnev:
 *           type: string
 *         email:
 *           type: string
 *         jelszo:
 *           type: string
 *       example:
 *         vezeteknev: "Kovács"
 *         keresztnev: "Béla"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *         msg:
 *           type: string
 *       example:
 *         code: 400
 *         msg: "Érvényes email címet adjon meg"
 */

/**
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     summary: Felhasználó lekérdezése email cím alapján
 *     tags: [Felhasznalo]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         example: "kovacs.janos@email.hu"
 *     responses:
 *       200:
 *         description: Felhasználó adatai
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Felhasznalo"
 *       400:
 *         description: Érvénytelen email formátum
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Felhasználó nem található
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/email/:email", userController.getUserByEmail);

/**
 * @swagger
 * /api/users/count/by-email:
 *   get:
 *     summary: Felhasználók száma email cím szerint csoportosítva (csak ahol több foglalás van)
 *     tags: [Felhasznalo]
 *     responses:
 *       200:
 *         description: Email és foglalások száma
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   foglalasok_szama:
 *                     type: integer
 */
router.get("/count/by-email", userController.getUserCountByEmail);

/**
 * @swagger
 * /api/users/top/list:
 *   get:
 *     summary: Legtöbbet foglaló felhasználók listája
 *     tags: [Felhasznalo]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Visszaadott felhasználók maximális száma
 *     responses:
 *       200:
 *         description: Top felhasználók listája
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   vezeteknev:
 *                     type: string
 *                   keresztnev:
 *                     type: string
 *                   email:
 *                     type: string
 *                   osszes_foglalas:
 *                     type: integer
 */
router.get("/top/list", userController.getTopUsers);

/**
 * @swagger
 * /api/users/date-range/list:
 *   get:
 *     summary: Felhasználók lekérdezése dátumtartomány alapján
 *     tags: [Felhasznalo]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2025-01-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2025-12-31"
 *     responses:
 *       200:
 *         description: Felhasználók listája
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Felhasznalo"
 *       400:
 *         description: Hiányzó vagy érvénytelen dátum
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/date-range/list", userController.getUsersByDateRange);

/**
 * @swagger
 * /api/users/etkezes/list:
 *   get:
 *     summary: Felhasználók étkezés típus szerint
 *     tags: [Felhasznalo]
 *     responses:
 *       200:
 *         description: Felhasználók listája
 */
router.get("/etkezes/list", userController.getUsersByEtkezesType);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Összes felhasználó lekérdezése
 *     tags: [Felhasznalo]
 *     responses:
 *       200:
 *         description: Felhasználók listája
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Felhasznalo"
 */
router.get("/", userController.getUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Felhasználó lekérdezése ID alapján
 *     tags: [Felhasznalo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Felhasználó adatai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Felhasznalo"
 *       404:
 *         description: Felhasználó nem található
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/:id", userController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Új felhasználó létrehozása
 *     tags: [Felhasznalo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateFelhasznalo"
 *     responses:
 *       201:
 *         description: Sikeresen létrehozott felhasználó (jelszó nélkül)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Felhasznalo"
 *       400:
 *         description: Hiányzó mező / érvénytelen email vagy telefonszám / már foglalt email vagy telefonszám
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/", userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Felhasználó adatainak módosítása
 *     description: "Csak a megadott mezők frissülnek. Telefonszám módosítása nem támogatott ezen az endpointon."
 *     tags: [Felhasznalo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateFelhasznalo"
 *     responses:
 *       200:
 *         description: Módosított felhasználó adatai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Felhasznalo"
 *       400:
 *         description: Érvénytelen adat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Felhasználó nem található
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put("/:id", userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Felhasználó törlése
 *     tags: [Felhasznalo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Felhasználó sikeresen törölve
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Felhasználó sikeresen törölve"
 *       404:
 *         description: Felhasználó nem található
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete("/:id", userController.deleteUser);

module.exports = router;