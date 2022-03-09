const express = require("express");
const users = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");
users.use(cors());

//environment variable to set secret key to sign JWT tokens
process.env.SECRET_KEY = "secret";

//password -> 1234 -> "skmdoandqmwimdoiwdimasodmaskmd"
//            1234 -> "asnisdnadniasndinasidnasindiua"
users.post("/register", (req, res) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }; //getting details from body
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;
          User.create(userData)
            .then((user) => {
              let token = jwt.sign(
                { user_id: user.id },
                process.env.SECRET_KEY,
                {
                  expiresIn: "24d",
                }
              );
              res.json({ token: token });
            })
            .catch((err) => {
              res.send("error: " + err);
            });
        });
      } else {
        res.json({ error: "User already exists" });
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

users.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (user) {
        //pswd provided    //hashed pswd, stored
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY, {
            expiresIn: "24d",
          });
          res.send({ token: token });
        } else {
          res.send("Wrong Password!");
        }
      } else {
        res.status(400).json({ error: "User does not exist" });
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

module.exports = users;
