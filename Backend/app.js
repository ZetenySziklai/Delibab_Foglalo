const express = require("express");
const app = express();
const api = express();
const cors = require("cors");


//cors
app.use(cors()); //talan kell csere
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const idopontRoutes = require("./api/routes/idopontRoutes");
app.use("/api", api);
api.use("/idopontok", idopontRoutes)




module.exports = app;