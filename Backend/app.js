const express = require("express");
const app = express();
const api = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./api/middlewares/errorHandler");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const userRoutes = require("./api/routes/felhasznaloRoutes");
const asztalRoutes = require("./api/routes/asztalRoutes");
const foglalasRoutes = require("./api/routes/foglalasRoutes");
const foglalasiAdatokRoutes = require("./api/routes/foglalasiAdatokRoutes");
const idopontRoutes = require("./api/routes/idopontRoutes");
const contactRoutes = require("./api/routes/contactRoutes");
const authRoutes = require("./api/routes/authRoutes");

app.use("/api", api);
api.use("/users", userRoutes);
api.use("/asztalok", asztalRoutes);
api.use("/foglalasok", foglalasRoutes);
api.use("/foglalasi-adatok", foglalasiAdatokRoutes);
api.use("/idopontok", idopontRoutes);
api.use("/contact", contactRoutes);
api.use("/auth", authRoutes);

app.use(errorHandler);

module.exports = app;