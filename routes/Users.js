const express = require("express");
const users = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");

//Set the secret key for signing and verifying JWT tokens
process.env.SECRET_KEY = "secret";

//Register a new user to the app
users.post("/register", (req, res) => {
  //Getting details from body
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  /**
   * Find a user based on the credentials provided
   */
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
              res.json({ message: "You are registered" });
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

//Login route; verify user credentials and send token
users.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (user) {
        /**
         * Brcypt will first hash the plain text received from body, then compare with stored hash.
         * If they match, user provided password is correct and token can be sent.
         */
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
