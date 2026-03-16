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
 *       required: [user_id, asztal_id, foglalas_datum]
 *       example:
 *         id: 1
 *         user_id: 1
 *         asztal_id: 2
 *         foglalas_datum: "2025-06-01 18:00:00"
 *     CreateFoglalas:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *         asztal_id:
 *           type: integer
 *         foglalas_datum:
 *           type: string
 *           format: date-time
 *       required: [user_id, asztal_id, foglalas_datum]
 *       example:
 *         user_id: 1
 *         asztal_id: 2
 *         foglalas_datum: "2025-06-01 18:00:00"
 */

/**
 * @swagger
 * /api/foglalasok/foglalt-idopontok/list:
 *   get:
 *     description: Foglalt időpontok lekérdezése adott dátumra és asztalra
 *     tags: [Foglalas]
 *     parameters:
 *       - in: query
 *         name: datum
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: asztalId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Foglalt időpontok listája
 */
router.get("/foglalt-idopontok/list", foglalasController.getFoglaltIdopontok);

/**
 * @swagger
 * /api/foglalasok/datum/list:
 *   get:
 *     description: Foglalások lekérdezése dátum alapján
 *     tags: [Foglalas]
 *     parameters:
 *       - in: query
 *         name: datum
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Foglalások listája
 */
router.get("/datum/list", foglalasController.getFoglalasByDatum);

/**
 * @swagger
 * /api/foglalasok/user/{userId}:
 *   get:
 *     description: Foglalások lekérdezése felhasználó alapján
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
 */
router.get("/user/:userId", foglalasController.getFoglalasByUser);

/**
 * @swagger
 * /api/foglalasok:
 *   get:
 *     description: Visszaadja az összes foglalást
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
 *     description: Foglalás lekérdezése ID alapján
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
 */
router.get("/:id", foglalasController.getFoglalasById);

/**
 * @swagger
 * /api/foglalasok:
 *   post:
 *     description: Új foglalás létrehozása
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
 */
router.post("/", foglalasController.createFoglalas);

/**
 * @swagger
 * /api/foglalasok/{id}:
 *   put:
 *     description: Foglalás módosítása
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
 *       404:
 *         description: Foglalás nem található
 */
router.put("/:id", foglalasController.updateFoglalas);

/**
 * @swagger
 * /api/foglalasok/{id}:
 *   delete:
 *     description: Foglalás törlése
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
 *       404:
 *         description: Foglalás nem található
 */
router.delete("/:id", foglalasController.deleteFoglalas);

module.exports = router;