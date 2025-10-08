const express = require("express")
const router = express.Router();
const idopontController = require("../controllers/IdopontController");

router.get("/", idopontController.getIdopontok);




module.exports = router;