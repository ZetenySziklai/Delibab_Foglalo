const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",     
  password: "",     
  database: "asztalfoglalás"
});

module.exports = pool.promise();