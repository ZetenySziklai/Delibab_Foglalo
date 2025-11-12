const db = require("../db");
const {userService} = require("../services")(db);

exports.getUser = async(req,res,next) =>{
  try {
    res.status(200).json(await userService.getUser());
  } catch (error) {
    next(error);
  }
}

exports.getUserById = async(req,res,next) =>{
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if(!user){
      return res.status(404).json({message: "Felhasználó nem található"});
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

exports.createUser = async(req,res,next) =>{
  try{
    const created = await userService.createUser(req.body);
    res.status(201).json(created);
  }catch(error){
    next(error);
  }
}

exports.updateUser = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const updated = await userService.updateUser(id, req.body);
    if(!updated){
      return res.status(404).json({message: "Felhasználó nem található"});
    }
    res.status(200).json(updated);
  }catch(error){
    next(error);
  }
}

exports.deleteUser = async(req,res,next) =>{
  try{
    const { id } = req.params;
    const deleted = await userService.deleteUser(id);
    if(!deleted){
      return res.status(404).json({message: "Felhasználó nem található"});
    }
    res.status(200).json({message: "Felhasználó sikeresen törölve"});
  }catch(error){
    next(error);
  }
}

