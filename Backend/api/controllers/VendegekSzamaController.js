const db = require("../db");
const {vendegekszamaService} = require("../services")(db);

exports.getVendegekSzama = async(req,res,next) =>{
  try {
    res.status(200).json(await vendegekszamaService.getVendegekSzama());
  } catch (error) {
    next(error);
  }
}

exports.getVendegekSzamaById = async(req,res,next) =>{
  try {
    const { id } = req.params;
    const vendeg = await vendegekszamaService.getVendegekSzamaById(id);
    if(!vendeg){
      return res.status(404).json({message: "Vendég nem található"});
    }
    res.status(200).json(vendeg);
  } catch (error) {
    next(error);
  }
}

exports.getVendegekSzamaByTotal = async(req,res,next) =>{
  try {
    const { total } = req.params;
    const vendegek = await vendegekszamaService.getVendegekSzamaByTotal(total);
    res.status(200).json(vendegek);
  } catch (error) {
    next(error);
  }
}

exports.createVendegekSzama = async(req,res,next) =>{
  try{
    const created = await vendegekszamaService.createVendegekSzama(req.body);
    res.status(201).json(created);
  }catch(error){
    next(error);
  }
}

exports.updateVendegekSzama = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const updated = await vendegekszamaService.updateVendegekSzama(id, req.body);
    if(!updated){
      return res.status(404).json({message: "Nem talalhato"});
    }
    res.status(200).json(updated);
  }catch(error){
    next(error);
  }
}

exports.deleteVendegekSzama = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const deleted = await vendegekszamaService.deleteVendegekSzama(id);
    if(!deleted){
      return res.status(404).json({message: "Vendég szám nem található"});
    }
    res.status(200).json({message: "Vendég szám sikeresen törölve"});
  }catch(error){
    next(error);
  }
}

exports.getVendegekSzamaStatistics = async(req,res,next) =>{
  try {
    const result = await vendegekszamaService.getVendegekSzamaStatistics();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

exports.getAverageVendegekSzama = async(req,res,next) =>{
  try {
    const result = await vendegekszamaService.getAverageVendegekSzama();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

exports.getVendegekSzamaWithFoglalok = async(req,res,next) =>{
  try {
    const result = await vendegekszamaService.getVendegekSzamaWithFoglalok();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

exports.getMostPopularVendegekSzama = async(req,res,next) =>{
  try {
    const { limit } = req.query;
    const result = await vendegekszamaService.getMostPopularVendegekSzama(limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

exports.getVendegekSzamaByTimeSlot = async(req,res,next) =>{
  try {
    const result = await vendegekszamaService.getVendegekSzamaByTimeSlot();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}