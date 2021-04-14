const { Pool } = require('pg')
const config = require('../../config/config')

const pool = new Pool(config.PG)

module.exports = async (sql, ...params) => {
  const client = await pool.connect()
  try {
    return (await client.query(sql, params)).rows
  } catch(error) {
    console.log(error.message)
  } finally {
    client.release()
  }
}