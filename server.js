var express = require("express");
// var cors = require("cors"); //cross origin resource sharing
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 8080;
var db = require("./database/db");

app.use(bodyParser.json()); //setting it up to handle JSON
// app.use(cors());

var Users = require("./routes/Users");
var Tasks = require("./routes/Tasks");

db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("table dropped and re-created");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/users", Users); //for user routes url -> localhost:PORT/users/
app.use("/api", Tasks); //for task related functionality -> localhost:PORT/api/

app.listen(port, function () {
  console.log("Server is running on port: " + port); //appending port no. to string
});

