const express = require("express")
const router = express.Router();
const foglalasController = require("../controllers/FoglalasController");

// Logikus funkciók (előbb kell lenniük, mint a paraméteres útvonalaknak)
router.get("/foglalt-idopontok/list", foglalasController.getFoglaltIdopontok);
router.get("/reserved-times", foglalasController.getAllReservedTimesByDate);
router.get("/datum/list", foglalasController.getFoglalasByDatum);
router.get("/user/:userId", foglalasController.getFoglalasByUser);

// CRUD műveletek
router.get("/", foglalasController.getFoglalas);
router.get("/:id", foglalasController.getFoglalasById);
router.post("/", foglalasController.createFoglalas);
router.put("/:id", foglalasController.updateFoglalas);
router.delete("/:id", foglalasController.deleteFoglalas);

module.exports = router;