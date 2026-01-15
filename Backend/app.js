const express = require("express");
const app = express();
const api = express();
const cors = require("cors");
const errorHandler = require("./api/middlewares/errorHandler");


//cors
app.use(cors()); //talan kell csere
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const userRoutes = require("./api/routes/userRoutes");
const asztalRoutes = require("./api/routes/asztalRoutes");
const foglalasRoutes = require("./api/routes/foglalasRoutes");
const foglaloRoutes = require("./api/routes/foglaloRoutes");
const allergenRoutes = require("./api/routes/allergenRoutes");
const allergeninfoRoutes = require("./api/routes/allergeninfoRoutes");
const megjegyzesRoutes = require("./api/routes/megjegyzesRoutes");
const asztalAllapotRoutes = require("./api/routes/asztalAllapotRoutes");
const etkezesTipusaRoutes = require("./api/routes/etkezesTipusaRoutes");
const idopontRoutes = require("./api/routes/idopontRoutes");

app.use("/api", api);
api.use("/users", userRoutes);
api.use("/asztalok", asztalRoutes);
api.use("/foglalasok", foglalasRoutes);
api.use("/foglalok", foglaloRoutes);
api.use("/allergenek", allergenRoutes);
api.use("/allergeninfok", allergeninfoRoutes);
api.use("/megjegyzesek", megjegyzesRoutes);
api.use("/asztal-allapotok", asztalAllapotRoutes);
api.use("/etkezes-tipusok", etkezesTipusaRoutes);
api.use("/idopontok", idopontRoutes);

// Error handler middleware - mindig az utolsóként kell használni
app.use(errorHandler);






module.exports = app;