const express = require("express")
const router = express.Router();
const foglaloController = require("../controllers/FoglaloController");

// GET - összes foglaló
router.get("/", foglaloController.getFoglalo);

// GET - foglaló email alapján
router.get("/email/:email", foglaloController.getFoglaloByEmail);

// POST - új foglaló létrehozása
router.post("/", foglaloController.createFoglalo);

// PUT - foglaló módosítása
router.put("/:id", foglaloController.updateFoglalo);

// DELETE - foglaló törlése
router.delete("/:id", foglaloController.deleteFoglalo);

// GET - foglalások száma email szerint (GROUP BY) - KOMPLEX LEKÉRDEZÉS
router.get("/statistics/count-by-email", foglaloController.getFoglaloCountByEmail);

module.exports = router;