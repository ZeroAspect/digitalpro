const { Sequelize } = require("sequelize");

const db = new Sequelize("mysql://root:ZMGINwHFNzVEVaocsGdgJmQwiwmzrpfw@junction.proxy.rlwy.net:32722/railway")

module.exports = db;