const express = require("express")
const router = express.Router();
const vendegekszamaController = require("../controllers/VendegekSzamaController");

// GET - összes vendég szám
router.get("/", vendegekszamaController.getVendegekSzama);

// GET - vendég szám ID alapján
router.get("/:id", vendegekszamaController.getVendegekSzamaById);

// GET - vendég számok összesen alapján
router.get("/total/:total", vendegekszamaController.getVendegekSzamaByTotal);

// POST - új vendég szám létrehozása
router.post("/", vendegekszamaController.createVendegekSzama);

// PUT - vendég szám módosítása
router.put("/:id", vendegekszamaController.updateVendegekSzama);

// DELETE - vendég szám törlése
router.delete("/:id", vendegekszamaController.deleteVendegekSzama);

// GET - vendég számok statisztikái (GROUP BY) - KOMPLEX LEKÉRDEZÉS
router.get("/statistics/group-by", vendegekszamaController.getVendegekSzamaStatistics);

module.exports = router;