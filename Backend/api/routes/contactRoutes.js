const express = require("express");
const router = express.Router();
const contactController = require("../controllers/ContactController");

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Kapcsolatfelvétel
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ContactMessage:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         message:
 *           type: string
 *       required: [name, email, message]
 *       example:
 *         name: "Kovács János"
 *         email: "kovacs.janos@email.hu"
 *         message: "Szeretnék asztalt foglalni egy különleges alkalomra."
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     description: Kapcsolatfelvételi üzenet küldése
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ContactMessage"
 *     responses:
 *       200:
 *         description: Üzenet sikeresen elküldve
 */
router.post("/", contactController.sendContactMessage);

module.exports = router;