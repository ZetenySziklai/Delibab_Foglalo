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
 *       example:
 *         id: 1
 *         helyek_szama: 4
 *     CreateAsztal:
 *       type: object
 *       required: [helyek_szama]
 *       properties:
 *         helyek_szama:
 *           type: integer
 *           minimum: 1
 *       example:
 *         helyek_szama: 4
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
 * /api/asztalok/szabad/list:
 *   get:
 *     summary: Szabad asztalok lekérdezése adott dátumra és időpontra
 *     description: "Visszaadja azokat az asztalokat, amelyekre a megadott időpontban nincs érvényes foglalás. Opcionálisan szűrhető minimális férőhely szerint."
 *     tags: [Asztal]
 *     parameters:
 *       - in: query
 *         name: datum
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2025-06-01"
 *       - in: query
 *         name: idopont
 *         required: true
 *         schema:
 *           type: string
 *         example: "12:00:00"
 *         description: "Formátum: HH:MM vagy HH:MM:SS"
 *       - in: query
 *         name: helyekSzama
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Minimálisan szükséges férőhelyek száma (opcionális)"
 *     responses:
 *       200:
 *         description: Szabad asztalok listája
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 datum:
 *                   type: string
 *                 idopont:
 *                   type: string
 *                 szabad_asztalok:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Asztal"
 *       400:
 *         description: Hiányzó datum vagy idopont paraméter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/szabad/list", asztalController.getSzabadAsztalok);

/**
 * @swagger
 * /api/asztalok:
 *   get:
 *     summary: Összes asztal lekérdezése
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
 *     summary: Asztal lekérdezése ID alapján
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/:id", asztalController.getAsztalById);

/**
 * @swagger
 * /api/asztalok:
 *   post:
 *     summary: Új asztal létrehozása
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
 *       400:
 *         description: Hiányzó vagy érvénytelen helyek_szama (pozitív egész szám szükséges)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/", asztalController.createAsztal);

/**
 * @swagger
 * /api/asztalok/{id}:
 *   put:
 *     summary: Asztal módosítása
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
 *         description: Módosított asztal adatai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Asztal"
 *       404:
 *         description: Asztal nem található
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put("/:id", asztalController.updateAsztal);

/**
 * @swagger
 * /api/asztalok/{id}:
 *   delete:
 *     summary: Asztal törlése
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Asztal sikeresen törölve"
 *       404:
 *         description: Asztal nem található
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete("/:id", asztalController.deleteAsztal);

module.exports = router;