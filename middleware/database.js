const pgp = require("pg-promise")(/*options*/);
const config = require("../configs/dev");
const db = pgp(config.pgURI);

module.exports = db;
