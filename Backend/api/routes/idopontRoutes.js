const express = require("express")
const router = express.Router();
const idopontController = require("../controllers/IdopontController");

// GET - összes időpont
router.get("/", idopontController.getIdopontok);

// GET - időpont ID alapján
router.get("/:id", idopontController.getIdopontById);

// GET - időpontok dátum alapján
router.get("/date/:date", idopontController.getIdopontokByDate);

// POST - új időpont létrehozása
router.post("/", idopontController.createIdopont);

// PUT - időpont módosítása
router.put("/:id", idopontController.updateIdopont);

// DELETE - időpont törlése
router.delete("/:id", idopontController.deleteIdopont);

// GET - foglalások száma naponként (GROUP BY) - KOMPLEX LEKÉRDEZÉS
router.get("/statistics/count-by-day", idopontController.getIdopontokCountByDay);

module.exports = router;