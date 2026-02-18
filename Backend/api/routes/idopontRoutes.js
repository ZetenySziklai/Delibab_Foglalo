const express = require("express")
const router = express.Router();
const idopontController = require("../controllers/IdopontController");

router.get("/", idopontController.getIdopont);
router.get("/:id", idopontController.getIdopontById);
router.post("/", idopontController.createIdopont);
router.put("/:id", idopontController.updateIdopont);
router.delete("/:id", idopontController.deleteIdopont);

module.exports = router;


