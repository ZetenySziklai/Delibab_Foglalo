const express = require("express")
const router = express.Router();
const asztalAllapotController = require("../controllers/AsztalAllapotController");

// CRUD műveletek
router.get("/", asztalAllapotController.getAsztalAllapot);
router.get("/:id", asztalAllapotController.getAsztalAllapotById);
router.post("/", asztalAllapotController.createAsztalAllapot);
router.put("/:id", asztalAllapotController.updateAsztalAllapot);
router.delete("/:id", asztalAllapotController.deleteAsztalAllapot);

module.exports = router;


