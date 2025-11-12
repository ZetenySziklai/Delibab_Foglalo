const db = require("../db");
const {etkezesTipusaService} = require("../services")(db);

exports.getEtkezesTipusa = async(req,res,next) =>{
  try {
    res.status(200).json(await etkezesTipusaService.getEtkezesTipusa());
  } catch (error) {
    next(error);
  }
}

exports.getEtkezesTipusaById = async(req,res,next) =>{
  try {
    const { id } = req.params;
    const etkezesTipusa = await etkezesTipusaService.getEtkezesTipusaById(id);
    if(!etkezesTipusa){
      return res.status(404).json({message: "Étkezés típusa nem található"});
    }
    res.status(200).json(etkezesTipusa);
  } catch (error) {
    next(error);
  }
}

exports.createEtkezesTipusa = async(req,res,next) =>{
  try{
    const created = await etkezesTipusaService.createEtkezesTipusa(req.body);
    res.status(201).json(created);
  }catch(error){
    next(error);
  }
}

exports.updateEtkezesTipusa = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const updated = await etkezesTipusaService.updateEtkezesTipusa(id, req.body);
    if(!updated){
      return res.status(404).json({message: "Étkezés típusa nem található"});
    }
    res.status(200).json(updated);
  }catch(error){
    next(error);
  }
}

exports.deleteEtkezesTipusa = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const deleted = await etkezesTipusaService.deleteEtkezesTipusa(id);
    if(!deleted){
      return res.status(404).json({message: "Étkezés típusa nem található"});
    }
    res.status(200).json({message: "Étkezés típusa sikeresen törölve"});
  }catch(error){
    next(error);
  }
}


