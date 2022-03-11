//Use Sequelize for library functions
const Sequelize = require("sequelize");

// Object to export and use database functionality outside of module
const db = {};

//Create a new object of Sequelize for database connection
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

//Connection that has been created
db.sequelize = sequelize;

//Expose the library functionality
db.Sequelize = Sequelize;

module.exports = db;
