const express = require("express")
const router = express.Router();
const idopontController = require("../controllers/IdopontController");

/**
 * @swagger
 * tags:
 *   name: Idopont
 *   description: Időpontok kezelése
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Idopont:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         kezdet:
 *           type: number
 *         veg:
 *           type: number
 *       required: [kezdet, veg]
 *       example:
 *         id: 1
 *         kezdet: 9
 *         veg: 10.5
 *     CreateIdopont:
 *       type: object
 *       properties:
 *         kezdet:
 *           type: number
 *         veg:
 *           type: number
 *       required: [kezdet, veg]
 *       example:
 *         kezdet: 9
 *         veg: 10.5
 */

/**
 * @swagger
 * /api/idopontok:
 *   get:
 *     description: Visszaadja az összes időpontot
 *     tags: [Idopont]
 *     responses:
 *       200:
 *         description: Időpontok listája
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Idopont"
 */
router.get("/", idopontController.getIdopont);

/**
 * @swagger
 * /api/idopontok/{id}:
 *   get:
 *     description: Időpont lekérdezése ID alapján
 *     tags: [Idopont]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Időpont adatai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Idopont"
 *       404:
 *         description: Időpont nem található
 */
router.get("/:id", idopontController.getIdopontById);

/**
 * @swagger
 * /api/idopontok:
 *   post:
 *     description: Új időpont létrehozása
 *     tags: [Idopont]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateIdopont"
 *     responses:
 *       201:
 *         description: Létrehozott időpont
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Idopont"
 */
router.post("/", idopontController.createIdopont);

/**
 * @swagger
 * /api/idopontok/{id}:
 *   put:
 *     description: Időpont módosítása
 *     tags: [Idopont]
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
 *             $ref: "#/components/schemas/CreateIdopont"
 *     responses:
 *       200:
 *         description: Módosított időpont
 *       404:
 *         description: Időpont nem található
 */
router.put("/:id", idopontController.updateIdopont);

/**
 * @swagger
 * /api/idopontok/{id}:
 *   delete:
 *     description: Időpont törlése
 *     tags: [Idopont]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Időpont sikeresen törölve
 *       404:
 *         description: Időpont nem található
 */
router.delete("/:id", idopontController.deleteIdopont);

module.exports = router;