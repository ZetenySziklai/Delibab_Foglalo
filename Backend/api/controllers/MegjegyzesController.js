const db = require("../db");
const {megjegyzesService} = require("../services")(db);

exports.getMegjegyzes = async(req,res,next) =>{
  try {
    res.status(200).json(await megjegyzesService.getMegjegyzes());
  } catch (error) {
    next(error);
  }
}

exports.getMegjegyzesById = async(req,res,next) =>{
  try {
    const { id } = req.params;
    const megjegyzes = await megjegyzesService.getMegjegyzesById(id);
    if(!megjegyzes){
      return res.status(404).json({message: "Megjegyzés nem található"});
    }
    res.status(200).json(megjegyzes);
  } catch (error) {
    next(error);
  }
}

exports.createMegjegyzes = async(req,res,next) =>{
  try{
    const created = await megjegyzesService.createMegjegyzes(req.body);
    res.status(201).json(created);
  }catch(error){
    next(error);
  }
}

exports.updateMegjegyzes = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const updated = await megjegyzesService.updateMegjegyzes(id, req.body);
    if(!updated){
      return res.status(404).json({message: "Megjegyzés nem található"});
    }
    res.status(200).json(updated);
  }catch(error){
    next(error);
  }
}

exports.deleteMegjegyzes = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const deleted = await megjegyzesService.deleteMegjegyzes(id);
    if(!deleted){
      return res.status(404).json({message: "Megjegyzés nem található"});
    }
    res.status(200).json({message: "Megjegyzés sikeresen törölve"});
  }catch(error){
    next(error);
  }
}


