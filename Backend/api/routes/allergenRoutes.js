const express = require("express")
const router = express.Router();
const allergenController = require("../controllers/AllergenController");

// CRUD műveletek
router.get("/", allergenController.getAllergen);
router.get("/:id", allergenController.getAllergenById);
router.post("/", allergenController.createAllergen);
router.put("/:id", allergenController.updateAllergen);
router.delete("/:id", allergenController.deleteAllergen);

module.exports = router;


