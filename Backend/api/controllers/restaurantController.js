exports.getData = (req,res,next) =>
{

    res.status(200).json({ uzenet: "ajnsdkngfsklfdgkfgkljgfkjfgskjfdgklfdgkjfdhkj" });
};

//npm install mysql2
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",       
//   password: "",     
//   database: "etterem" 
// });

// exports.getData = (req, res) => {
//   db.query("SELECT * FROM restaurants", (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: "Adatbázis hiba" });
//     }
//     res.json(results); 
//   });
// };