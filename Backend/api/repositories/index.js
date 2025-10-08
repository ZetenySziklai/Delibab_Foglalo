const IdopontRepository = require("./IdopontRepository");

module.exports = (db) =>{
    const idopontRepository = new IdopontRepository(db);

    return {idopontRepository};
}