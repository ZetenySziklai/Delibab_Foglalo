const db = require("../db");
const {asztalService} = require("../services")(db);

exports.getAsztal = async(req,res,next) =>{
  try {
    res.status(200).json(await asztalService.getAsztal());
  } catch (error) {
    next(error);
  }
}

exports.getAsztalById = async(req,res,next) =>{
  try {
    const { id } = req.params;
    const asztal = await asztalService.getAsztalById(id);
    if(!asztal){
      return res.status(404).json({message: "Asztal nem található"});
    }
    res.status(200).json(asztal);
  } catch (error) {
    next(error);
  }
}

exports.createAsztal = async(req,res,next) =>{
  try{
    const created = await asztalService.createAsztal(req.body);
    res.status(201).json(created);
  }catch(error){
    next(error);
  }
}

exports.updateAsztal = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const updated = await asztalService.updateAsztal(id, req.body);
    if(!updated){
      return res.status(404).json({message: "Asztal nem található"});
    }
    res.status(200).json(updated);
  }catch(error){
    next(error);
  }
}

exports.deleteAsztal = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const deleted = await asztalService.deleteAsztal(id);
    if(!deleted){
      return res.status(404).json({message: "Asztal nem található"});
    }
    res.status(200).json({message: "Asztal sikeresen törölve"});
  }catch(error){
    next(error);
  }
}

exports.getSzabadAsztalok = async(req,res,next) =>{
  try {
    const { datum, idopont, helyekSzama } = req.query;
    if(!datum || !idopont){
      return res.status(400).json({message: "Dátum és időpont kötelező"});
    }
    const szabadAsztalok = await asztalService.getSzabadAsztalok(datum, idopont, helyekSzama);
    res.status(200).json({
      datum: datum,
      idopont: idopont,
      helyek_szama: helyekSzama || "nincs megadva",
      szabad_asztalok: szabadAsztalok
    });
  } catch (error) {
    next(error);
  }
}
