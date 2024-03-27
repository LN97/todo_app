const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./model');

// Initialize express app
const app = express();

// Use CORS middleware
app.use(cors());
require('dotenv').config();


// Use express json middleware to parse JSON bodies
app.use(express.json());

// MongoDB URI - replace 'your_mongodb_uri' with your actual MongoDB URI
const mongoURI = process.env.mongoURI;
// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});


// Create a new Todo item
app.post('/api/todos', async (req, res) => {
  const { title, description } = req.body;
  const todo = new Todo({
    title,
    description,
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all Todo items
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    console.log('hit api ')
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a Todo item
app.patch('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!todo) {
      return res.status(404).json({ message: 'Cannot find todo item' });
    }
    res.json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a Todo item
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Cannot find todo item' });
    }
    res.json({ message: 'Deleted Todo' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));