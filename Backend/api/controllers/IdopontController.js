const db = require("../db");
const {idopontService} = require("../services")(db);
const { NotFoundError } = require("../errors");

exports.getIdopont = async(req,res,next) =>{
  try {
    res.status(200).json(await idopontService.getIdopont());
  } catch (error) {
    next(error);
  }
}

exports.getIdopontById = async(req,res,next) =>{
  try {
    const { id } = req.params;
    const idopont = await idopontService.getIdopontById(id);
    if(!idopont){
      throw new NotFoundError("Időpont nem található");
    }
    res.status(200).json(idopont);
  } catch (error) {
    next(error);
  }
}

exports.createIdopont = async(req,res,next) =>{
  try{
    const created = await idopontService.createIdopont(req.body);
    res.status(201).json(created);
  }catch(error){
    next(error);
  }
}

exports.updateIdopont = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const updated = await idopontService.updateIdopont(id, req.body);
    if(!updated){
      throw new NotFoundError("Időpont nem található");
    }
    res.status(200).json(updated);
  }catch(error){
    next(error);
  }
}

exports.deleteIdopont = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const deleted = await idopontService.deleteIdopont(id);
    if(!deleted){
      throw new NotFoundError("Időpont nem található");
    }
    res.status(200).json({message: "Időpont sikeresen törölve"});
  }catch(error){
    next(error);
  }
}


