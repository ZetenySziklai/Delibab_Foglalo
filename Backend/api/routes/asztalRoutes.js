const express = require("express")
const router = express.Router();
const asztalController = require("../controllers/AsztalController");

// Logikus funkciók (előbb kell lenniük, mint a paraméteres útvonalaknak)
router.get("/szabad/list", asztalController.getSzabadAsztalok);

// CRUD műveletek
router.get("/", asztalController.getAsztal);
router.get("/:id", asztalController.getAsztalById);
router.post("/", asztalController.createAsztal);
router.put("/:id", asztalController.updateAsztal);
router.delete("/:id", asztalController.deleteAsztal);

module.exports = router;
