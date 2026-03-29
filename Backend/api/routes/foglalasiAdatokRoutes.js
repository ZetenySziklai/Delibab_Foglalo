const express = require("express")
const router = express.Router();
const foglalasiAdatokController = require("../controllers/FoglalasiAdatokController");

/**
 * @swagger
 * tags:
 *   name: FoglalasiAdatok
 *   description: Foglalási adatok kezelése
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FoglalasiAdatok:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         foglalas_datum:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         megjegyzes:
 *           type: string
 *           nullable: true
 *         felnott:
 *           type: integer
 *         gyerek:
 *           type: integer
 *         FoglalasId:
 *           type: integer
 *           nullable: true
 *       example:
 *         id: 1
 *         foglalas_datum: "2025-06-01T19:00:00.000Z"
 *         megjegyzes: "Ablak melletti asztal kérés"
 *         felnott: 2
 *         gyerek: 1
 *         FoglalasId: 1
 *     CreateFoglalasiAdatok:
 *       type: object
 *       required: [felnott, gyerek]
 *       properties:
 *         FoglalasId:
 *           type: integer
 *           nullable: true
 *           description: "Opcionális – a kapcsolódó foglalás ID-ja"
 *         foglalas_datum:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Opcionális"
 *         megjegyzes:
 *           type: string
 *           nullable: true
 *         felnott:
 *           type: integer
 *           minimum: 0
 *         gyerek:
 *           type: integer
 *           minimum: 0
 *       example:
 *         FoglalasId: 1
 *         foglalas_datum: "2025-06-01T19:00:00.000Z"
 *         megjegyzes: "Ablak melletti asztal kérés"
 *         felnott: 2
 *         gyerek: 1
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
 * /api/foglalasi-adatok:
 *   get:
 *     summary: Összes foglalási adat lekérdezése
 *     tags: [FoglalasiAdatok]
 *     responses:
 *       200:
 *         description: Foglalási adatok listája
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/FoglalasiAdatok"
 */
router.get("/", foglalasiAdatokController.getFoglalasiAdatok);

/**
 * @swagger
 * /api/foglalasi-adatok/{id}:
 *   get:
 *     summary: Foglalási adat lekérdezése ID alapján
 *     tags: [FoglalasiAdatok]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Foglalási adatok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FoglalasiAdatok"
 *       404:
 *         description: Foglalási adatok nem találhatók
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/:id", foglalasiAdatokController.getFoglalasiAdatokById);

/**
 * @swagger
 * /api/foglalasi-adatok:
 *   post:
 *     summary: Új foglalási adat létrehozása
 *     tags: [FoglalasiAdatok]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateFoglalasiAdatok"
 *     responses:
 *       201:
 *         description: Létrehozott foglalási adatok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FoglalasiAdatok"
 *       400:
 *         description: Hiányzó felnott/gyerek mező, vagy negatív érték
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: A megadott foglalás (FoglalasId) nem létezik
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/", foglalasiAdatokController.createFoglalasiAdatok);

/**
 * @swagger
 * /api/foglalasi-adatok/{id}:
 *   put:
 *     summary: Foglalási adatok módosítása
 *     tags: [FoglalasiAdatok]
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
 *             $ref: "#/components/schemas/CreateFoglalasiAdatok"
 *     responses:
 *       200:
 *         description: Módosított foglalási adatok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FoglalasiAdatok"
 *       400:
 *         description: Negatív felnott vagy gyerek érték
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Foglalási adatok nem találhatók
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put("/:id", foglalasiAdatokController.updateFoglalasiAdatok);

/**
 * @swagger
 * /api/foglalasi-adatok/{id}:
 *   delete:
 *     summary: Foglalási adatok törlése
 *     tags: [FoglalasiAdatok]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Foglalási adatok sikeresen törölve
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Foglalási adatok sikeresen törölve"
 *       404:
 *         description: Foglalási adatok nem találhatók
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete("/:id", foglalasiAdatokController.deleteFoglalasiAdatok);

module.exports = router;