//Dependencies
const express = require('express');
//const cors = require('cors');
const mongoose = require('mongoose');

//todo Set up separate route file
//Require the routes
//const routes = require("./routes");

//Require the mongo todo model
let Todo = require('./models/todo.model');

//Set path and port
const path = require("path");
const PORT = process.env.PORT || 4000;

// Define middleware here
// Initialize Express
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(cors());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

//Sets the root route to /todos, all others are based on this
const todoRoutes = express.Router();
app.use('/todos', todoRoutes);

// Connect to the Mongo DB **********************************************
// If deployed, use the deployed database. Otherwise use the local database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todos';

// Connect to the db
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//Display connection message
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

//! Routes ****************************************
//Get all todos
todoRoutes.route('/').get(function(req, res) {
  Todo.find(function(err, todos) {
      if (err) {
          console.log(err);
      } else {
          res.json(todos);
      }
  });
});

//Get specific todo
todoRoutes.route('/:id').get(function(req, res) {
  let id = req.params.id;
  Todo.findById(id, function(err, todo) {
      res.json(todo);
  });
});

//Add a todo
todoRoutes.route('/add').post(function(req, res) {
  let todo = new Todo(req.body);
  todo.save()
      .then(todo => {
          res.status(200).json({'todo': 'todo added successfully'});
      })
      .catch(err => {
          res.status(400).send('adding new todo failed');
      });
});

//Post to update todo
todoRoutes.route('/update/:id').post(function(req, res) {
  Todo.findById(req.params.id, function(err, todo) {
      if (!todo)
          res.status(404).send("data is not found");
      else
          //Update
          todo.todo_description = req.body.todo_description;
          todo.todo_responsible = req.body.todo_responsible;
          todo.todo_priority = req.body.todo_priority;
          todo.todo_completed = req.body.todo_completed;

          //Save
          todo.save().then(todo => {
              res.json('Todo updated!');
          })
          .catch(err => {
              res.status(400).send("Update not possible");
          });
  });
});

// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });  

//Listen to the Port
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});