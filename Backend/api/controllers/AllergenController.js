const db = require("../db");
const {allergenService} = require("../services")(db);

exports.getAllergen = async(req,res,next) =>{
  try {
    res.status(200).json(await allergenService.getAllergen());
  } catch (error) {
    next(error);
  }
}

exports.getAllergenById = async(req,res,next) =>{
  try {
    const { id } = req.params;
    const allergen = await allergenService.getAllergenById(id);
    if(!allergen){
      return res.status(404).json({message: "Allergen nem található"});
    }
    res.status(200).json(allergen);
  } catch (error) {
    next(error);
  }
}

exports.createAllergen = async(req,res,next) =>{
  try{
    const created = await allergenService.createAllergen(req.body);
    res.status(201).json(created);
  }catch(error){
    next(error);
  }
}

exports.updateAllergen = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const updated = await allergenService.updateAllergen(id, req.body);
    if(!updated){
      return res.status(404).json({message: "Allergen nem található"});
    }
    res.status(200).json(updated);
  }catch(error){
    next(error);
  }
}

exports.deleteAllergen = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const deleted = await allergenService.deleteAllergen(id);
    if(!deleted){
      return res.status(404).json({message: "Allergen nem található"});
    }
    res.status(200).json({message: "Allergen sikeresen törölve"});
  }catch(error){
    next(error);
  }
}



