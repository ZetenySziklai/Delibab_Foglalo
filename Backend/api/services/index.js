const IdopontService = require("./IdopontService");
module.exports = (db) => {
    const idopontService = new IdopontService(db);

    return {idopontService};
}