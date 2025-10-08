const db = require("../db");
const {idopontService} = require("../services")(db);

exports.getIdopontok = async(req,res,next) =>{
  try {
    res.status(200).json(await idopontService.getIdopontok());
  } catch (error) {
    next(error);
  }
}