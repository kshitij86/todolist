const Sequelize = require("sequelize");
const db = require("../database/db.js");

/**
 * Task to be created
 * user_id -> identify the user that created the task
 * user1 -> task1
 * user2 should not be able to edit/delete task1
 */

module.exports = db.sequelize.define("task", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
  user_id: {
    type: Sequelize.INTEGER,
  }, 
});
