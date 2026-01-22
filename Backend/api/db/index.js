const { Sequelize, DataTypes, Model } = require("sequelize");

const dialect = process.env.DB_DIALECT || 'mysql';
const dialectOptions = {};

// MySQL-specifikus beállítások csak MySQL esetén
if (dialect === 'mysql') {
  dialectOptions.charset = 'utf8mb4';
  // A collate opciót nem támogatja a MySQL2 driver a kapcsolati szinten
  // A collation automatikusan beállításra kerül a charset alapján
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: dialect,
    port: process.env.DB_PORT,
    logging: false,
    storage: dialect === 'sqlite' ? process.env.DB_NAME : undefined,
    dialectOptions: Object.keys(dialectOptions).length > 0 ? dialectOptions : undefined
  }
);

const models = require("../models")(sequelize);

const db = {
  sequelize, 
  Sequelize,
  ...models,
};

// Csak akkor futtassuk az automatikus sync-et, ha nem tesztekben vagyunk
if (process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
  (async () =>{
    try {
      console.log("DataBase sync started");
      await db.sequelize.sync({alter:true});
      console.log("DataBase sync OK");
    } catch (error) {
      console.error('Failed sync to DataBase', error);
      // Ne dobjunk hibát, hogy a tesztek ne akadjanak el
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  })();
}

module.exports = db;