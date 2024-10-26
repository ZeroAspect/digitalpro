const { createPool } = require("mysql2");

async function MySQL(){
  const connection = await createPool({
    uri: "mysql://root:ZMGINwHFNzVEVaocsGdgJmQwiwmzrpfw@junction.proxy.rlwy.net:32722/railway"
  })
  const pool = connection.promisse()
  return pool
}

module.exports = MySQL