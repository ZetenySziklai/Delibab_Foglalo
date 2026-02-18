const express = require("express")
const router = express.Router();
const foglalasController = require("../controllers/FoglalasController");


router.get("/foglalt-idopontok/list", foglalasController.getFoglaltIdopontok);
router.get("/datum/list", foglalasController.getFoglalasByDatum);
router.get("/user/:userId", foglalasController.getFoglalasByUser);


router.get("/", foglalasController.getFoglalas);
router.get("/:id", foglalasController.getFoglalasById);
router.post("/", foglalasController.createFoglalas);
router.put("/:id", foglalasController.updateFoglalas);
router.delete("/:id", foglalasController.deleteFoglalas);

module.exports = router;