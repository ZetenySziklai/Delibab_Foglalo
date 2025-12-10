const db = require("../db");
const {allergeninfoService} = require("../services")(db);
const { NotFoundError } = require("../errors");

exports.getAllergeninfo = async(req,res,next) =>{
  try {
    res.status(200).json(await allergeninfoService.getAllergeninfo());
  } catch (error) {
    next(error);
  }
}

exports.getAllergeninfoById = async(req,res,next) =>{
  try {
    const { id } = req.params;
    const allergeninfo = await allergeninfoService.getAllergeninfoById(id);
    if(!allergeninfo){
      throw new NotFoundError("Allergen info nem található");
    }
    res.status(200).json(allergeninfo);
  } catch (error) {
    next(error);
  }
}

exports.createAllergeninfo = async(req,res,next) =>{
  try{
    const created = await allergeninfoService.createAllergeninfo(req.body);
    res.status(201).json(created);
  }catch(error){
    next(error);
  }
}

exports.updateAllergeninfo = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const updated = await allergeninfoService.updateAllergeninfo(id, req.body);
    if(!updated){
      throw new NotFoundError("Allergen info nem található");
    }
    res.status(200).json(updated);
  }catch(error){
    next(error);
  }
}

exports.deleteAllergeninfo = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const deleted = await allergeninfoService.deleteAllergeninfo(id);
    if(!deleted){
      throw new NotFoundError("Allergen info nem található");
    }
    res.status(200).json({message: "Allergen info sikeresen törölve"});
  }catch(error){
    next(error);
  }
}

exports.getAllergeninfoByFoglalas = async(req,res,next) =>{
  try {
    const { foglalasId } = req.params;
    const allergeninfok = await allergeninfoService.getAllergeninfoByFoglalas(foglalasId);
    res.status(200).json(allergeninfok);
  } catch (error) {
    next(error);
  }
}

exports.deleteAllergeninfoByFoglalas = async(req,res,next) =>{
  try{
    const { foglalasId } = req.params;
    const deleted = await allergeninfoService.deleteAllergeninfoByFoglalas(foglalasId);
    if(!deleted){
      throw new NotFoundError("Nincs allergen info ezen foglaláshoz");
    }
    res.status(200).json({message: "Allergen infók sikeresen törölve"});
  }catch(error){
    next(error);
  }
}


