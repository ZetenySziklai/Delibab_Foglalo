const express = require("express")
const router = express.Router();
const etkezesTipusaController = require("../controllers/EtkezesTipusaController");

// CRUD műveletek
router.get("/", etkezesTipusaController.getEtkezesTipusa);
router.get("/:id", etkezesTipusaController.getEtkezesTipusaById);
router.post("/", etkezesTipusaController.createEtkezesTipusa);
router.put("/:id", etkezesTipusaController.updateEtkezesTipusa);
router.delete("/:id", etkezesTipusaController.deleteEtkezesTipusa);

module.exports = router;


