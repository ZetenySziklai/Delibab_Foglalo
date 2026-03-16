const express = require("express")
const router = express.Router();
const asztalController = require("../controllers/AsztalController");

/**
 * @swagger
 * tags:
 *   name: Asztal
 *   description: Asztalok kezelése
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Asztal:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         helyek_szama:
 *           type: integer
 *       required: [helyek_szama]
 *       example:
 *         id: 1
 *         helyek_szama: 4
 *     CreateAsztal:
 *       type: object
 *       properties:
 *         helyek_szama:
 *           type: integer
 *       required: [helyek_szama]
 *       example:
 *         helyek_szama: 4
 */

/**
 * @swagger
 * /api/asztalok/szabad/list:
 *   get:
 *     description: Szabad asztalok lekérdezése adott dátumra és időpontra
 *     tags: [Asztal]
 *     parameters:
 *       - in: query
 *         name: datum
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: idopont
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: helyekSzama
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Szabad asztalok listája
 */
router.get("/szabad/list", asztalController.getSzabadAsztalok);

/**
 * @swagger
 * /api/asztalok:
 *   get:
 *     description: Visszaadja az összes asztalt
 *     tags: [Asztal]
 *     responses:
 *       200:
 *         description: Asztalok listája
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Asztal"
 */
router.get("/", asztalController.getAsztal);

/**
 * @swagger
 * /api/asztalok/{id}:
 *   get:
 *     description: Asztal lekérdezése ID alapján
 *     tags: [Asztal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asztal adatai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Asztal"
 *       404:
 *         description: Asztal nem található
 */
router.get("/:id", asztalController.getAsztalById);

/**
 * @swagger
 * /api/asztalok:
 *   post:
 *     description: Új asztal létrehozása
 *     tags: [Asztal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateAsztal"
 *     responses:
 *       201:
 *         description: Létrehozott asztal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Asztal"
 */
router.post("/", asztalController.createAsztal);

/**
 * @swagger
 * /api/asztalok/{id}:
 *   put:
 *     description: Asztal módosítása
 *     tags: [Asztal]
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
 *             $ref: "#/components/schemas/CreateAsztal"
 *     responses:
 *       200:
 *         description: Módosított asztal
 *       404:
 *         description: Asztal nem található
 */
router.put("/:id", asztalController.updateAsztal);

/**
 * @swagger
 * /api/asztalok/{id}:
 *   delete:
 *     description: Asztal törlése
 *     tags: [Asztal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asztal sikeresen törölve
 *       404:
 *         description: Asztal nem található
 */
router.delete("/:id", asztalController.deleteAsztal);

module.exports = router;