var express = require("express");
var tasks = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");

const Task = require("../models/Task");

tasks.use(cors());

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InVzZXIxIiwiZW1haWwiOiJ1c2VyMUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRlOEhBeGlRN2NLWG5vTjhiQjRvZEoueGVkS2QvalVnNFVHc3lkcnBTamkuejBIb09PRS5NcSIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMDhUMTE6NTE6MzguNTUzWiIsImNyZWF0ZWRBdCI6IjIwMjItMDMtMDhUMTE6NTE6MzguNTUzWiIsImlhdCI6MTY0Njc0MDI5OCwiZXhwIjoxNjQ4ODEzODk4fQ.maSERRVqKqpfMRdX20BigWomTsyVcH95ECeovSe6Keo

process.env.SECRET_KEY = "secret";

//Get all tasks for user
tasks.get("/tasks", function (req, res, next) {
  if (req.headers["authorization"]) {
    var decoded = jwt.verify(
      req.headers["authorization"],
      process.env.SECRET_KEY
    );
    Task.findAll({
      where: {
        user_id: decoded.id,
      },
    })
      .then((tasks) => {
        res.send(tasks);
      })
      .catch((err) => {
        res.send("error: " + err);
      });
  } else {
    res.json({ status: "failed", message: "Token not passed !" });
    console.log("Token Not Passed");
  }
});

//Get a specific task  -> {name: "Party", status: "done"}
tasks.get("/task/:id", function (req, res, next) {
  if (req.headers["authorization"]) {
    var decoded = jwt.verify(
      req.headers["authorization"],
      process.env.SECRET_KEY
    );
    Task.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((task) => {
        if (task) {
          res.send(task);
        } else {
          res.send("Task does not exist");
        }
      })
      .catch((err) => {
        res.send("error: " + err);
      });
  } else {
    res.json({ status: "failed", message: "Token not passed !" });
    console.log("Token Not Passed");
  }
});

//Get the status of the task
//URL -> localhost:8080/api/task/status -> {status: "done"}
tasks.get("/task/status/:id", function (req, res, next) {
  if (req.headers["authorization"]) {
    Task.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((task) => {
        if (task) {
          res.json({ status: task.status });
        } else {
          res.send("Task does not exist");
        }
      })
      .catch((err) => {
        res.send("error: " + err);
      });
  } else {
    res.json({ status: "failed", message: "Token not passed !" });
    console.log("Token Not Passed");
  }
});

// Create a new task 
tasks.post("/task", function (req, res, next) {
  if (req.headers["authorization"]) {
    if (!req.body.name && !req.body.status) {
      res.status(400);
      res.json({
        error: "Bad Data",
      });
    } else {
      var decoded = jwt.verify(
        req.headers["authorization"],
        process.env.SECRET_KEY
      );
      const user_id = decoded.id;
      req.body.user_id = user_id;
      console.log("req-body", req.body);
      Task.create(req.body)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.json("error: " + err);
        });
    }
  } else {
    res.json({ status: "failed", message: "Token not passed !" });
    console.log("Token Not Passed");
  }
});

// Delete a task 
tasks.delete("/task/:id", function (req, res, next) {
  if (req.headers["authorization"]) {
    var decoded = jwt.verify(
      req.headers["authorization"],
      process.env.SECRET_KEY
    );
    console.log("user_decoded_id", decoded.id);
    Task.findOne({
      where: {
        user_id: decoded.id,
        id: req.params.id,
      },
    })
      .then((task) => {
        if (task) {
          //delete from database
          Task.destroy({
            where: {
              id: req.params.id,
            },
          })
            .then(() => {
              res.json({ status: "Task Deleted!" });
            })
            .catch((err) => {
              res.send("error: " + err);
            });
        } else {
          res.json({ status: "failed", message: "Task not found" });
        }
      })
      .catch((err) => {
        res.json({ status: "failed", message: "Task not found or task does not belong to user" });
      });
  } else {
    res.json({ status: "failed", message: "Token not passed !" });
    console.log("Token Not Passed");
  }
});

tasks.put("/task/edit/:id", function (req, res, next) {
  if (req.headers["authorization"]) {
    if (!req.body.name && !req.body.status) {
      res.status(400);
      res.json({
        error: "Bad Data",
      });
    } else {
      var decoded = jwt.verify(
        req.headers["authorization"],
        process.env.SECRET_KEY
      );
      console.log("user_decoded_id", decoded.id);
      Task.findOne({
        where: {
          user_id: decoded.id,
          id: req.params.id,
        },
      })
        .then((task) => {
          if (task) {
            Task.update(
              { name: req.body.name },
              { where: { id: req.params.id } }
            )
              .then(() => {
                res.json({ status: "success", message: "Task Updated !" });
              })
              .error((err) => handleError(err));
          } else {
            res.json({ status: "failed", message: "Task not found" });
          }
        })
        .catch((err) => {
          res.json({ status: "failed", message: "Task not found" });
        });
    }
  } else {
    res.json({ status: "failed", message: "Token not passed !" });
    console.log("Token Not Passed");
  }
});

tasks.put("/task/complete/:id", function (req, res, next) {
  if (req.headers["authorization"]) {
    var decoded = jwt.verify(
      req.headers["authorization"],
      process.env.SECRET_KEY
    );
    console.log("user_decoded_id", decoded.id);
    Task.findOne({
      where: {
        user_id: decoded.id,
        id: req.params.id,
      },
    })
      .then((task) => {
        if (task) {
          Task.update({ status: "Done" }, { where: { id: req.params.id } })
            .then(() => {
              res.json({ status: "success", message: "Task Updated !" });
            })
            .error((err) => handleError(err));
        } else {
          res.json({ status: "failed", message: "Task not found" });
        }
      })
      .catch((err) => {
        res.json({ status: "failed", message: "Task not found" });
      });
  } else {
    res.json({ status: "failed", message: "Token not passed !" });
    console.log("Token Not Passed");
  }
});

module.exports = tasks;
