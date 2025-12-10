const db = require("../db");
const {asztalAllapotService} = require("../services")(db);
const { NotFoundError } = require("../errors");

exports.getAsztalAllapot = async(req,res,next) =>{
  try {
    res.status(200).json(await asztalAllapotService.getAsztalAllapot());
  } catch (error) {
    next(error);
  }
}

exports.getAsztalAllapotById = async(req,res,next) =>{
  try {
    const { id } = req.params;
    const asztalAllapot = await asztalAllapotService.getAsztalAllapotById(id);
    if(!asztalAllapot){
      throw new NotFoundError("Asztal állapot nem található");
    }
    res.status(200).json(asztalAllapot);
  } catch (error) {
    next(error);
  }
}

exports.createAsztalAllapot = async(req,res,next) =>{
  try{
    const created = await asztalAllapotService.createAsztalAllapot(req.body);
    res.status(201).json(created);
  }catch(error){
    next(error);
  }
}

exports.updateAsztalAllapot = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const updated = await asztalAllapotService.updateAsztalAllapot(id, req.body);
    if(!updated){
      throw new NotFoundError("Asztal állapot nem található");
    }
    res.status(200).json(updated);
  }catch(error){
    next(error);
  }
}

exports.deleteAsztalAllapot = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const deleted = await asztalAllapotService.deleteAsztalAllapot(id);
    if(!deleted){
      throw new NotFoundError("Asztal állapot nem található");
    }
    res.status(200).json({message: "Asztal állapot sikeresen törölve"});
  }catch(error){
    next(error);
  }
}


