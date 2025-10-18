const db = require("../db");
const {etkezestipusaService} = require("../services")(db);

exports.getEtkezesTipusa = async(req,res,next) =>{
  try {
    res.status(200).json(await etkezestipusaService.getEtkezesTipusa());
  } catch (error) {
    next(error);
  }
}

exports.getEtkezesTipusaById = async(req,res,next) =>{
  try {
    const { id } = req.params;
    const etkezes = await etkezestipusaService.getEtkezesTipusaById(id);
    if(!etkezes){
      return res.status(404).json({message: "Étkezés típusa nem található"});
    }
    res.status(200).json(etkezes);
  } catch (error) {
    next(error);
  }
}

exports.getEtkezesTipusaByType = async(req,res,next) =>{
  try {
    const { type } = req.params;
    const etkezesek = await etkezestipusaService.getEtkezesTipusaByType(type);
    res.status(200).json(etkezesek);
  } catch (error) {
    next(error);
  }
}

exports.createEtkezesTipusa = async(req,res,next) =>{
  try{
    const created = await etkezestipusaService.createEtkezesTipusa(req.body);
    res.status(201).json(created);
  }catch(error){
    next(error);
  }
}

exports.updateEtkezesTipusa = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const updated = await etkezestipusaService.updateEtkezesTipusa(id, req.body);
    if(!updated){
      return res.status(404).json({message: "Nem talalhato"});
    }
    res.status(200).json(updated);
  }catch(error){
    next(error);
  }
}

exports.deleteEtkezesTipusa = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const deleted = await etkezestipusaService.deleteEtkezesTipusa(id);
    if(!deleted){
      return res.status(404).json({message: "Étkezés típusa nem található"});
    }
    res.status(200).json({message: "Étkezés típusa sikeresen törölve"});
  }catch(error){
    next(error);
  }
}

exports.getEtkezesTipusaStatistics = async(req,res,next) =>{
  try {
    const result = await etkezestipusaService.getEtkezesTipusaStatistics();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

exports.getEtkezesTipusaWithFoglalok = async(req,res,next) =>{
  try {
    const result = await etkezestipusaService.getEtkezesTipusaWithFoglalok();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

exports.getEtkezesTipusaByTimeSlot = async(req,res,next) =>{
  try {
    const result = await etkezestipusaService.getEtkezesTipusaByTimeSlot();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

exports.getMostPopularEtkezesCombinations = async(req,res,next) =>{
  try {
    const { limit } = req.query;
    const result = await etkezestipusaService.getMostPopularEtkezesCombinations(limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

exports.getEtkezesTipusaWithVendegekSzama = async(req,res,next) =>{
  try {
    const result = await etkezestipusaService.getEtkezesTipusaWithVendegekSzama();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}