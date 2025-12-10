const db = require("../db");
const {idopontService} = require("../services")(db);
const { NotFoundError } = require("../errors");

exports.getIdopontok = async(req,res,next) =>{
  try {
    res.status(200).json(await idopontService.getIdopontok());
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

exports.getIdopontokByDate = async(req,res,next) =>{
  try {
    const { date } = req.params;
    const idopontok = await idopontService.getIdopontokByDate(date);
    res.status(200).json(idopontok);
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

exports.getIdopontokCountByDay = async(req,res,next) =>{
  try {
    const result = await idopontService.getIdopontokCountByDay();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

exports.getIdopontokCountByHour = async(req,res,next) =>{
  try {
    const result = await idopontService.getIdopontokCountByHour();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

exports.getIdopontokWithVendegekSzama = async(req,res,next) =>{
  try {
    const result = await idopontService.getIdopontokWithVendegekSzama();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

exports.getMostPopularTimeSlots = async(req,res,next) =>{
  try {
    const { limit } = req.query;
    const result = await idopontService.getMostPopularTimeSlots(limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}