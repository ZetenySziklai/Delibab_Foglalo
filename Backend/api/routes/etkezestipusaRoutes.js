const express = require("express")
const router = express.Router();
const etkezestipusaController = require("../controllers/EtkezesTipusaController");

// GET - összes étkezés típusa
router.get("/", etkezestipusaController.getEtkezesTipusa);

// GET - étkezés típusa ID alapján
router.get("/:id", etkezestipusaController.getEtkezesTipusaById);

// GET - étkezés típusok típus alapján (reggeli, ebed, vacsora)
router.get("/type/:type", etkezestipusaController.getEtkezesTipusaByType);

// POST - új étkezés típusa létrehozása
router.post("/", etkezestipusaController.createEtkezesTipusa);

// PUT - étkezés típusa módosítása
router.put("/:id", etkezestipusaController.updateEtkezesTipusa);

// DELETE - étkezés típusa törlése
router.delete("/:id", etkezestipusaController.deleteEtkezesTipusa);

module.exports = router;