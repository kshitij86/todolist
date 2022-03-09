const Sequelize = require("sequelize"); //library functions 
const db = {};

//
//create a new object of Sequelize
const sequelize = new Sequelize("todo", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}); //creating the database connection

db.sequelize = sequelize; //connection that has been created 
db.Sequelize = Sequelize; //creating a new Sequelize -> expose the library functionality

module.exports = db;
