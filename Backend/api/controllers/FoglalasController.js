const db = require("../db");
const {foglalasService} = require("../services")(db);

exports.getFoglalas = async(req,res,next) =>{
  try {
    res.status(200).json(await foglalasService.getFoglalas());
  } catch (error) {
    next(error);
  }
}

exports.getFoglalasById = async(req,res,next) =>{
  try {
    const { id } = req.params;
    const foglalas = await foglalasService.getFoglalasById(id);
    if(!foglalas){
      return res.status(404).json({message: "Foglalás nem található"});
    }
    res.status(200).json(foglalas);
  } catch (error) {
    next(error);
  }
}

exports.createFoglalas = async(req,res,next) =>{
  try{
    const created = await foglalasService.createFoglalas(req.body);
    res.status(201).json(created);
  }catch(error){
    next(error);
  }
}

exports.updateFoglalas = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const updated = await foglalasService.updateFoglalas(id, req.body);
    if(!updated){
      return res.status(404).json({message: "Foglalás nem található"});
    }
    res.status(200).json(updated);
  }catch(error){
    next(error);
  }
}

exports.deleteFoglalas = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const deleted = await foglalasService.deleteFoglalas(id);
    if(!deleted){
      return res.status(404).json({message: "Foglalás nem található"});
    }
    res.status(200).json({message: "Foglalás sikeresen törölve"});
  }catch(error){
    next(error);
  }
}

exports.getFoglaltIdopontok = async(req,res,next) =>{
  try {
    const { datum, asztalId } = req.query;
    if(!datum || !asztalId){
      return res.status(400).json({message: "Dátum és asztal ID kötelező"});
    }
    const foglaltIdopontok = await foglalasService.getFoglaltIdopontok(datum, asztalId);
    res.status(200).json({ 
      datum: datum,
      asztal_id: asztalId,
      foglalt_idopontok: foglaltIdopontok 
    });
  } catch (error) {
    next(error);
  }
}

exports.getFoglalasByDatum = async(req,res,next) =>{
  try {
    const { datum } = req.query;
    if(!datum){
      return res.status(400).json({message: "Dátum kötelező"});
    }
    const foglalasok = await foglalasService.getFoglalasByDatum(datum);
    res.status(200).json(foglalasok);
  } catch (error) {
    next(error);
  }
}

exports.getFoglalasByUser = async(req,res,next) =>{
  try {
    const { userId } = req.params;
    const foglalasok = await foglalasService.getFoglalasByUser(userId);
    res.status(200).json(foglalasok);
  } catch (error) {
    next(error);
  }
}