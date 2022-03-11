var express = require("express");
var tasks = express.Router();
const jwt = require("jsonwebtoken");

const Task = require("../models/Task");

process.env.SECRET_KEY = "secret";

/**
 * These are authorized/protected requests so a token is mandatory
 */

//Get all tasks for user
tasks.get("/tasks", function (req, res, next) {
  if (req.headers["authorization"]) {
    var decoded = jwt.verify(
      req.headers["authorization"],
      process.env.SECRET_KEY
    );
    //Find all the tasks for that user
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
      /**
       * Every task has a user_id associated with it, so that needs to be part of task created
       */
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
    /**
     * While finding a user, the user_id is passed to make sure the user that created task is deleting it
     */
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
        res.json({
          status: "failed",
          message: "Task not found or task does not belong to user",
        });
      });
  } else {
    res.json({ status: "failed", message: "Token not passed !" });
    console.log("Token Not Passed");
  }
});

// Modify a task/Edit a task
/**
 * When a task is modified, the entire object should be provided
 * {
 *   "name": "friday",
 *   "status": "done"
 * }
 *
 */
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
      //verify that task exists
      Task.findOne({
        where: {
          user_id: decoded.id,
          id: req.params.id,
        },
      })
        .then((task) => {
          if (task) {
            //Update the value in the database
            Task.update(
              { name: req.body.name, status: req.body.status },
              { where: { id: req.params.id } }
            )
              .then(() => {
                res.json({ status: "success", message: "Task Updated !" });
              })
              .catch((err) => console.log(err));
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

//Update a task as done/complete
//No request body needed
tasks.put("/task/complete/:id", function (req, res, next) {
  if (req.headers["authorization"]) {
    var decoded = jwt.verify(
      req.headers["authorization"],
      process.env.SECRET_KEY
    );
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
            .catch((err) => console.log(err));
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
