exports.getData = (req,res,next) =>
{

    res.status(200).json({ uzenet: "ajnsdkngfsklfdgkfgkljgfkjfgskjfdgklfdgkjfdhkj" });
};



const db = require("../config/db");

exports.getAdatB = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM foglaló");
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Adatbázis lekérdezési hiba" });
  }
};