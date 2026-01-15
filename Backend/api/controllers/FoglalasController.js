const db = require("../db");
const {foglalasService} = require("../services")(db);
const { NotFoundError } = require("../errors");

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
      throw new NotFoundError("Foglalás nem található");
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
      throw new NotFoundError("Foglalás nem található");
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
      throw new NotFoundError("Foglalás nem található");
    }
    res.status(200).json({message: "Foglalás sikeresen törölve"});
  }catch(error){
    next(error);
  }
}

exports.getFoglaltIdopontok = async(req,res,next) =>{
  try {
    const { datum, asztalId } = req.query;
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

exports.getAllReservedTimesByDate = async(req,res,next) =>{
  try {
    const { datum } = req.query;
    const reservedTimes = await foglalasService.getAllReservedTimesByDate(datum);
    res.status(200).json(reservedTimes);
  } catch (error) {
    next(error);
  }
}

exports.getFoglalasByDatum = async(req,res,next) =>{
  try {
    const { datum } = req.query;
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