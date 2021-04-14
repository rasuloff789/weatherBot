require('dotenv').config()

module.exports = {
  token: process.env.token,
  weatherapitoken:process.env.weatherapitoken,
  PG: {
    host: process.env.dbHost,
    port: process.env.dbPort,
    user: process.env.dbUser,
    password: process.env.dbPassword,
    database: process.env.dbName
  }
}