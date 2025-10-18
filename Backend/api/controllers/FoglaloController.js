const db = require("../db");
const {foglaloService} = require("../services")(db);

exports.getFoglalo = async(req,res,next) =>{
  try {
    res.status(200).json(await foglaloService.getFoglalo());
  } catch (error) {
    next(error);
  }
}

exports.getFoglaloByEmail = async(req,res,next) =>{
  try {
    const { email } = req.params;
    const foglalo = await foglaloService.getFoglaloByEmail(email);
    if(!foglalo || foglalo.length === 0){
      return res.status(404).json({message: "Foglaló nem található"});
    }
    res.status(200).json(foglalo);
  } catch (error) {
    next(error);
  }
}

exports.createFoglalo = async(req,res,next) =>{
  try{
    const created = await foglaloService.createFoglalo(req.body);
    res.status(201).json(created);
  }catch(error){
    next(error);
  }
}

exports.updateFoglalo = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const updated = await foglaloService.updateFoglalo(id, req.body);
    if(!updated){
      return res.status(404).json({message: "Nem talalhato"});
    }
    res.status(200).json(updated);
  }catch(error){
    next(error);
  }
}

exports.deleteFoglalo = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const deleted = await foglaloService.deleteFoglalo(id);
    if(!deleted){
      return res.status(404).json({message: "Foglaló nem található"});
    }
    res.status(200).json({message: "Foglaló sikeresen törölve"});
  }catch(error){
    next(error);
  }
}

exports.getFoglaloCountByEmail = async(req,res,next) =>{
  try {
    const result = await foglaloService.getFoglaloCountByEmail();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

exports.getTopFoglalok = async(req,res,next) =>{
  try {
    const { limit } = req.query;
    const result = await foglaloService.getTopFoglalok(limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

exports.getFoglalokByDateRange = async(req,res,next) =>{
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({message: "Kezdő és végdátum megadása kötelező"});
    }
    const result = await foglaloService.getFoglalokByDateRange(startDate, endDate);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

exports.getFoglalokByEtkezesType = async(req,res,next) =>{
  try {
    const result = await foglaloService.getFoglalokByEtkezesType();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}