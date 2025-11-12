const express = require("express")
const router = express.Router();
const allergeninfoController = require("../controllers/AllergeninfoController");

// Logikus funkciók (előbb kell lenniük, mint a paraméteres útvonalaknak)
router.get("/foglalas/:foglalasId", allergeninfoController.getAllergeninfoByFoglalas);
router.delete("/foglalas/:foglalasId", allergeninfoController.deleteAllergeninfoByFoglalas);

// CRUD műveletek
router.get("/", allergeninfoController.getAllergeninfo);
router.get("/:id", allergeninfoController.getAllergeninfoById);
router.post("/", allergeninfoController.createAllergeninfo);
router.put("/:id", allergeninfoController.updateAllergeninfo);
router.delete("/:id", allergeninfoController.deleteAllergeninfo);

module.exports = router;


