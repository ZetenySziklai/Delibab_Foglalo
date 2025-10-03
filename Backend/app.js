const express = require("express");
const app = express();
const cors = require("cors");

//cors
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const restaurantRoutes = require("./api/routes/restaurantRoutes");
app.use("/api/restaurants", restaurantRoutes);

module.exports = app;