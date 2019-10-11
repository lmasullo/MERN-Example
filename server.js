//Dependencies
const express = require('express');
const todoRoutes = express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

//Set the port
const PORT = process.env.PORT || 4000;

//Require the mongo todo model
let Todo = require('./models/todo.model');

//Middleware
app.use(cors());
app.use(bodyParser.json());
//Sets the root route to /todos, all others are based on this
app.use('/todos', todoRoutes);
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

//Set the mongo connection settings
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todos';

//Connect to the MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})


//Routes
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


//Listen to the Port
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});