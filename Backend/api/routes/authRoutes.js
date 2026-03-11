const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/login", authController.login);
router.get("/status", authController.status);
router.delete("/logout", [ authMiddleware.verifyToken ], authController.logout);

module.exports = router;
