const express = require("express");
const app = express();
const api = express();
const cors = require("cors");
const errorHandler = require("./api/middlewares/errorHandler");


//cors
app.use(cors()); //talan kell csere
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const userRoutes = require("./api/routes/felhasznaloRoutes");
const asztalRoutes = require("./api/routes/asztalRoutes");
const foglalasRoutes = require("./api/routes/foglalasRoutes");
const foglalasiAdatokRoutes = require("./api/routes/foglalasiAdatokRoutes");
const idopontRoutes = require("./api/routes/idopontRoutes");

app.use("/api", api);
api.use("/users", userRoutes);
api.use("/asztalok", asztalRoutes);
api.use("/foglalasok", foglalasRoutes);
api.use("/foglalasi-adatok", foglalasiAdatokRoutes);
api.use("/idopontok", idopontRoutes);

// Error handler middleware - mindig az utolsóként kell használni
app.use(errorHandler);






module.exports = app;