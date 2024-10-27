const mysql = require("mysql2");

async function MySQL(){
  const connection = mysql.createPool({
    uri: "mysql://root:ZMGINwHFNzVEVaocsGdgJmQwiwmzrpfw@junction.proxy.rlwy.net:32722/railway"
  })
  const pool = connection.promise()
  return pool
}

module.exports = MySQL