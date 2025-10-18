const express = require("express");
const app = express();
const api = express();
const cors = require("cors");


//cors
app.use(cors()); //talan kell csere
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const idopontRoutes = require("./api/routes/idopontRoutes");
const foglaloRoutes = require("./api/routes/foglaloRoutes");
const vendegszamaRoutes = require("./api/routes/vendegekszamaRoutes"); 
const etkezestipusaRoutes = require("./api/routes/etkezestipusaRoutes")

app.use("/api", api);
api.use("/idopontok", idopontRoutes)
api.use("/foglalo", foglaloRoutes)
api.use("/vendegekszama", vendegszamaRoutes)
api.use("/etkezestipusa", etkezestipusaRoutes)







module.exports = app;