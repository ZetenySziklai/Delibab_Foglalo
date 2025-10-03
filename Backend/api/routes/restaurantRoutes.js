const express = require("express")
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

//router.get("/", restaurantController.getData);

router.get("/", restaurantController.getAdatB);




module.exports = router;