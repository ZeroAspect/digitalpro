const { DataTypes } = require("sequelize");
const db = require("../sequelize/sequelize.js");

const Users = db.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false // Ensures username is unique
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    senha: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    biografia: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ip: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    data: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }
)

module.exports = Users