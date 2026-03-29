const express = require("express")
const router = express.Router();
const foglalasController = require("../controllers/FoglalasController");

/**
 * @swagger
 * tags:
 *   name: Foglalas
 *   description: Foglalások kezelése
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Foglalas:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         asztal_id:
 *           type: integer
 *         foglalas_datum:
 *           type: string
 *           format: date-time
 *         IdopontId:
 *           type: integer
 *           nullable: true
 *         Felhasznalo:
 *           type: object
 *           properties:
 *             vezeteknev:
 *               type: string
 *             keresztnev:
 *               type: string
 *             email:
 *               type: string
 *             telefonszam:
 *               type: string
 *         asztal:
 *           type: object
 *           properties:
 *             helyek_szama:
 *               type: integer
 *       example:
 *         id: 1
 *         user_id: 1
 *         asztal_id: 2
 *         foglalas_datum: "2025-06-01T18:00:00.000Z"
 *         IdopontId: 1
 *     CreateFoglalas:
 *       type: object
 *       required: [user_id, asztal_id, foglalas_datum]
 *       properties:
 *         user_id:
 *           type: integer
 *         asztal_id:
 *           type: integer
 *         foglalas_datum:
 *           type: string
 *           format: date-time
 *         IdopontId:
 *           type: integer
 *           nullable: true
 *       example:
 *         user_id: 1
 *         asztal_id: 2
 *         foglalas_datum: "2025-06-01 18:00:00"
 *         IdopontId: 1
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *         msg:
 *           type: string
 */

/**
 * @swagger
 * /api/foglalasok/foglalt-idopontok/list:
 *   get:
 *     summary: Foglalt időpontok lekérdezése adott dátumra és asztalra
 *     tags: [Foglalas]
 *     parameters:
 *       - in: query
 *         name: datum
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2025-06-01"
 *       - in: query
 *         name: asztalId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Foglalt időpontok listája
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 datum:
 *                   type: string
 *                 asztal_id:
 *                   type: string
 *                 foglalt_idopontok:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Foglalas"
 */
router.get("/foglalt-idopontok/list", foglalasController.getFoglaltIdopontok);

/**
 * @swagger
 * /api/foglalasok/datum/list:
 *   get:
 *     summary: Foglalások lekérdezése dátum alapján
 *     tags: [Foglalas]
 *     parameters:
 *       - in: query
 *         name: datum
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2025-06-01"
 *     responses:
 *       200:
 *         description: Foglalások listája az adott napra
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Foglalas"
 *       400:
 *         description: Hiányzó datum paraméter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/datum/list", foglalasController.getFoglalasByDatum);

/**
 * @swagger
 * /api/foglalasok/user/{userId}:
 *   get:
 *     summary: Adott felhasználó összes foglalása
 *     tags: [Foglalas]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Foglalások listája
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Foglalas"
 *       400:
 *         description: Hiányzó userId paraméter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/user/:userId", foglalasController.getFoglalasByUser);

/**
 * @swagger
 * /api/foglalasok:
 *   get:
 *     summary: Összes foglalás lekérdezése
 *     tags: [Foglalas]
 *     responses:
 *       200:
 *         description: Foglalások listája
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Foglalas"
 */
router.get("/", foglalasController.getFoglalas);

/**
 * @swagger
 * /api/foglalasok/{id}:
 *   get:
 *     summary: Foglalás lekérdezése ID alapján
 *     tags: [Foglalas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Foglalás adatai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Foglalas"
 *       404:
 *         description: Foglalás nem található
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/:id", foglalasController.getFoglalasById);

/**
 * @swagger
 * /api/foglalasok:
 *   post:
 *     summary: Új foglalás létrehozása
 *     tags: [Foglalas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateFoglalas"
 *     responses:
 *       201:
 *         description: Létrehozott foglalás
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Foglalas"
 *       400:
 *         description: Hiányzó kötelező mező
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: A megadott felhasználó vagy asztal nem létezik
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/", foglalasController.createFoglalas);

/**
 * @swagger
 * /api/foglalasok/{id}:
 *   put:
 *     summary: Foglalás módosítása
 *     tags: [Foglalas]
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
 *             $ref: "#/components/schemas/CreateFoglalas"
 *     responses:
 *       200:
 *         description: Módosított foglalás
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Foglalas"
 *       404:
 *         description: Foglalás nem található
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put("/:id", foglalasController.updateFoglalas);

/**
 * @swagger
 * /api/foglalasok/{id}:
 *   delete:
 *     summary: Foglalás törlése
 *     tags: [Foglalas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Foglalás sikeresen törölve
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Foglalás sikeresen törölve"
 *       404:
 *         description: Foglalás nem található
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete("/:id", foglalasController.deleteFoglalas);

module.exports = router;