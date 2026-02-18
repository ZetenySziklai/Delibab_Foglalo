const db = require("../db");
const {foglalasiAdatokService} = require("../services")(db);
const { NotFoundError } = require("../errors");

exports.getFoglalasiAdatok = async(req,res,next) =>{
  try {
    res.status(200).json(await foglalasiAdatokService.getFoglalasiAdatok());
  } catch (error) {
    next(error);
  }
}

exports.getFoglalasiAdatokById = async(req,res,next) =>{
  try {
    const { id } = req.params;
    const foglalasiAdatok = await foglalasiAdatokService.getFoglalasiAdatokById(id);
    if(!foglalasiAdatok){
      throw new NotFoundError("Foglalási adatok nem találhatók");
    }
    res.status(200).json(foglalasiAdatok);
  } catch (error) {
    next(error);
  }
}

exports.createFoglalasiAdatok = async(req,res,next) =>{
  try{
    const created = await foglalasiAdatokService.createFoglalasiAdatok(req.body);
    res.status(201).json(created);
  }catch(error){
    next(error);
  }
}

exports.updateFoglalasiAdatok = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const updated = await foglalasiAdatokService.updateFoglalasiAdatok(id, req.body);
    if(!updated){
      throw new NotFoundError("Foglalási adatok nem találhatók");
    }
    res.status(200).json(updated);
  }catch(error){
    next(error);
  }
}

exports.deleteFoglalasiAdatok = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const deleted = await foglalasiAdatokService.deleteFoglalasiAdatok(id);
    if(!deleted){
      throw new NotFoundError("Foglalási adatok nem találhatók");
    }
    res.status(200).json({message: "Foglalási adatok sikeresen törölve"});
  }catch(error){
    next(error);
  }
}


