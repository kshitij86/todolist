//Handling imports
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 8080;
var db = require("./database/db");

//Setting it up to handle JSON
app.use(bodyParser.json());

var Users = require("./routes/Users");
var Tasks = require("./routes/Tasks");

//Initial setup for database tables and sync
db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("table dropped and re-created");
  })
  .catch((err) => {
    console.log(err.message);
  });

//For user routes url -> localhost:PORT/users/
app.use("/users", Users);

//For task related functionality -> localhost:PORT/api/
app.use("/api", Tasks);

//Listen on the specified port for incoming API requests
app.listen(port, function () {
  console.log("Server is running on port: " + port);
});
