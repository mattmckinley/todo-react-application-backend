const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "todos"
});

app.get("/tasks", function (req, res) {
  connection.query("SELECT * FROM task", function (err, data) {
    if (err) {
      console.log("Error fetching tasks", err);
      res.status(500).json({
        error: err
      });
    } else {
      res.json({
        tasks: data
      });
    }
  });
});

// Request body will look like this
// const body = {
//   text: "Do first draft CV",
//   completed: false,
//   date: "2020-06-20",
//   userId: 3
// }
// EACH KEY IN BODY NEEDS TO BE EXACTLY SAME AS MYSQL FORMAT IN RDS!!!

app.post("/tasks", function (req, res) {
  const query = "INSERT INTO task (text, completed, date, userId) VALUES (?, ?, ?, ?);";
  connection.query(query, [req.body.text, req.body.completed, req.body.date, req.body.userId], function (error, data) {
    if (error) {
      console.log("Error adding a task", error);
      res.status(500).json({
        error: error
      });
    } else {
      res.status(201).json({
        data: data
      });
    }
  });
});

app.delete("/tasks/:taskId", function (req, res) {
  const deleteQuery = "DELETE FROM task WHERE taskId=?";
  connection.query(deleteQuery, [req.params.taskId], function (error, data) {
    if (error) {
      console.log("Error deleting a task", error);
      res.status(500).json({
        error: error
      });
    } else {
      res.status(200).send(data);
    }
  });
});

app.put("/tasks/:taskId", function (req, res) {
  const updateQuery = "UPDATE task SET text=?, completed=?, date=? WHERE taskId=?";
  connection.query(updateQuery, [req.body.text, req.body.completed, req.body.date, req.params.taskId], function (error, data) {
    if (error) {
      console.log("Error deleting a task", error);
      res.status(500).json({
        error: error
      });
    } else {
      res.sendStatus(200);
    }
  });
});


module.exports.handler = serverless(app);
