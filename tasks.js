const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/tasks", function(req, res) {
  const someTasks = [
    {
      text: "Watch AWS Lambda videos to get better understanding",
      completed: false,
      dueDate: "2020-06-13",
      id: 1
    },
    {
      text: "JS challenges week 10",
      completed: false,
      dueDate: "2020-06-20",
      id: 2
    },
    {
      text: "Do first draft CV",
      completed: false,
      dueDate: "2020-06-20",
      id: 3
    }
  ];
  res.send({someTasks});
});

app.post("/tasks", function(req, res) {
  const text = req.body.text;
  const date = req.body.date;

  res.json({
    message: `Received a request to add task ${text} with date ${date}`
  });
});

app.delete("/tasks/:taskId", function(req, res) {
  const id = req.params.taskId;

  // Respond to the request somehow
});

module.exports.handler = serverless(app);
