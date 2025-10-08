const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false
  }
);

const models = require("../models")(sequelize);

const db = {
  sequelize, 
  Sequelize,
  ...models,
};

(async () =>{
  try {
    console.log("DataBase sync started");
    await db.sequelize.sync({alter:true});
    console.log("DataBase sync OK");
  } catch (error) {
    console.error('Failed sync to DataBase', error);
    throw error;
  }
})();

//-------


// (async () =>{
//     try {
//     await sequelize.authenticate();
//     console.log('Adatbázis kapcsolat sikeresen létrejött.');
//     }
//     catch (error) {
//     console.error('Nem sikerült csatlakozni az adatbázishoz:', error);
//     throw error;
//   }
// })();




//---------





module.exports = db;