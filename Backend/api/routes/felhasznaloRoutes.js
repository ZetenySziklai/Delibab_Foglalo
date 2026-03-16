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
 *         jelszo:
 *           type: string
 *       required: [vezeteknev, keresztnev, email, telefonszam, jelszo]
 *       example:
 *         id: 1
 *         vezeteknev: "Kovács"
 *         keresztnev: "János"
 *         email: "kovacs.janos@email.hu"
 *         telefonszam: "06301234567"
 *         jelszo: "titkosJelszo"
 *     CreateFelhasznalo:
 *       type: object
 *       properties:
 *         vezeteknev:
 *           type: string
 *         keresztnev:
 *           type: string
 *         email:
 *           type: string
 *         telefonszam:
 *           type: string
 *         jelszo:
 *           type: string
 *       required: [vezeteknev, keresztnev, email, telefonszam, jelszo]
 *       example:
 *         vezeteknev: "Kovács"
 *         keresztnev: "János"
 *         email: "kovacs.janos@email.hu"
 *         telefonszam: "06301234567"
 *         jelszo: "titkosJelszo"
 */

/**
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     description: Felhasználó lekérdezése email cím alapján
 *     tags: [Felhasznalo]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Felhasználó adatai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Felhasznalo"
 */
router.get("/email/:email", userController.getUserByEmail);

/**
 * @swagger
 * /api/users/count/by-email:
 *   get:
 *     description: Felhasználók számának lekérdezése email cím szerint csoportosítva
 *     tags: [Felhasznalo]
 *     responses:
 *       200:
 *         description: Email és foglalások száma
 */
router.get("/count/by-email", userController.getUserCountByEmail);

/**
 * @swagger
 * /api/users/top/list:
 *   get:
 *     description: Legtöbbet foglaló felhasználók listája
 *     tags: [Felhasznalo]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Top felhasználók listája
 */
router.get("/top/list", userController.getTopUsers);

/**
 * @swagger
 * /api/users/date-range/list:
 *   get:
 *     description: Felhasználók lekérdezése dátumtartomány alapján
 *     tags: [Felhasznalo]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Felhasználók listája
 */
router.get("/date-range/list", userController.getUsersByDateRange);

/**
 * @swagger
 * /api/users/etkezes/list:
 *   get:
 *     description: Felhasználók étkezés típus szerint
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
 *     description: Visszaadja az összes felhasználót
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
 *     description: Felhasználó lekérdezése ID alapján
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
 */
router.get("/:id", userController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     description: Új felhasználó létrehozása
 *     tags: [Felhasznalo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateFelhasznalo"
 *     responses:
 *       201:
 *         description: Létrehozott felhasználó
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Felhasznalo"
 */
router.post("/", userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     description: Felhasználó módosítása
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
 *             $ref: "#/components/schemas/CreateFelhasznalo"
 *     responses:
 *       200:
 *         description: Módosított felhasználó
 *       404:
 *         description: Felhasználó nem található
 */
router.put("/:id", userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     description: Felhasználó törlése
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
 *       404:
 *         description: Felhasználó nem található
 */
router.delete("/:id", userController.deleteUser);

module.exports = router;