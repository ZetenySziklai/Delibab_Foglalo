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
 *         megjegyzes:
 *           type: string
 *           nullable: true
 *         felnott:
 *           type: integer
 *         gyerek:
 *           type: integer
 *       required: [foglalas_datum, felnott, gyerek]
 *       example:
 *         id: 1
 *         foglalas_datum: "2025-06-01 18:00:00"
 *         megjegyzes: "Ablak melletti asztal kérés"
 *         felnott: 2
 *         gyerek: 1
 *     CreateFoglalasiAdatok:
 *       type: object
 *       properties:
 *         foglalas_id:
 *           type: integer
 *         foglalas_datum:
 *           type: string
 *           format: date-time
 *         megjegyzes:
 *           type: string
 *           nullable: true
 *         felnott:
 *           type: integer
 *         gyerek:
 *           type: integer
 *       required: [foglalas_datum, felnott, gyerek]
 *       example:
 *         foglalas_id: 1
 *         foglalas_datum: "2025-06-01 18:00:00"
 *         megjegyzes: "Ablak melletti asztal kérés"
 *         felnott: 2
 *         gyerek: 1
 */

/**
 * @swagger
 * /api/foglalasi-adatok:
 *   get:
 *     description: Visszaadja az összes foglalási adatot
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
 *     description: Foglalási adatok lekérdezése ID alapján
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
 */
router.get("/:id", foglalasiAdatokController.getFoglalasiAdatokById);

/**
 * @swagger
 * /api/foglalasi-adatok:
 *   post:
 *     description: Új foglalási adatok létrehozása
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
 */
router.post("/", foglalasiAdatokController.createFoglalasiAdatok);

/**
 * @swagger
 * /api/foglalasi-adatok/{id}:
 *   put:
 *     description: Foglalási adatok módosítása
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
 *       404:
 *         description: Foglalási adatok nem találhatók
 */
router.put("/:id", foglalasiAdatokController.updateFoglalasiAdatok);

/**
 * @swagger
 * /api/foglalasi-adatok/{id}:
 *   delete:
 *     description: Foglalási adatok törlése
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
 *       404:
 *         description: Foglalási adatok nem találhatók
 */
router.delete("/:id", foglalasiAdatokController.deleteFoglalasiAdatok);

module.exports = router;