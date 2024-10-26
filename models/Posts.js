const { DataTypes } = require("sequelize");
const db = require("../sequelize/sequelize.js");

const Posts = db.define(
  "Posts",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    titulo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    post_like: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }
)

module.exports = Posts;