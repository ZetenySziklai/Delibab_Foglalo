const express = require("express")
const router = express.Router();
const megjegyzesController = require("../controllers/MegjegyzesController");

// CRUD műveletek
router.get("/", megjegyzesController.getMegjegyzes);
router.get("/:id", megjegyzesController.getMegjegyzesById);
router.post("/", megjegyzesController.createMegjegyzes);
router.put("/:id", megjegyzesController.updateMegjegyzes);
router.delete("/:id", megjegyzesController.deleteMegjegyzes);

module.exports = router;


