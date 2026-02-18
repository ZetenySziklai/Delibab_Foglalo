const express = require("express")
const router = express.Router();
const foglalasiAdatokController = require("../controllers/FoglalasiAdatokController");

router.get("/", foglalasiAdatokController.getFoglalasiAdatok);
router.get("/:id", foglalasiAdatokController.getFoglalasiAdatokById);
router.post("/", foglalasiAdatokController.createFoglalasiAdatok);
router.put("/:id", foglalasiAdatokController.updateFoglalasiAdatok);
router.delete("/:id", foglalasiAdatokController.deleteFoglalasiAdatok);

module.exports = router;


