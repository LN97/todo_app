const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./model');
const { uploadImage } = require('./cloudinary');


// Initialize express app
const app = express();

// Use CORS middleware
app.use(cors());
require('dotenv').config();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Uses express json middleware to parse JSON bodies
app.use(express.json());

// MongoDB URI - replaces 'mongodb_uri' with actual MongoDB URI
const mongoURI = process.env.mongoURI;
// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Define a simple route
app.get('/', (req, res) => {
  res.send('To Do App Backend API');
});


// Create a new Todo item
app.post('/api/todos', async (req, res) => {
  const { title, description , location, reminderDate } = req.body;
  try {
    const todo = new Todo({
      title,
      description,
      location, reminderDate
    });
  
    let todoSaved = await todo.save();
    console.log( todoSaved );
    // Fetch the updated list of todo items
    const newTodos = await Todo.find({});
    // Send the updated list of todo items back to the client
    res.json({ newTodos , taskId: todoSaved._id });
  } catch (err) {
    console.log( 'err' )
    res.status(400).json({ message: err });
  }
});

// update task with image

app.post('/api/todos/:id/image' , async ( req , res ) => {
    try {
      const { id } = req.params; 
      const { image } = req.body;
      
      let cloudinaryUrl = await uploadImage( image );
      await Todo.findByIdAndUpdate( { _id: id}, { photoUri: cloudinaryUrl });
      const updatedTodos = await Todo.find({});
      // Return the updated list
      res.json({ updatedTodos });
    }
    catch( err ) {
      console.log( err )
      res.status(400).json({ message: err });
    }
});2

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

app.put('/api/todos/:id', async ( req , res ) => {
  const { id } = req.params;
  const { title, description, reminderDate } = req.body;

  try {
    console.log('editing task')
    // Find the todo item by id and update it
    await Todo.findByIdAndUpdate(id, { title, description, reminderDate });
    // Optionally, return the updated list of todos
    const updatedTodos = await Todo.find();

    // Assuming you want to return the updated list and the task id
    res.json({ newTodos: updatedTodos });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update the status of a todo item
app.put('/api/todos/:id/status', async (req, res) => {
  try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).send('Todo not found');
      }

      // Toggle the status or set it based on the request
      todo.status = req.body.status !== undefined ? req.body.status : !todo.status;
      await todo.save();
    // Fetch the updated list of todo items
    const updatedTodos = await Todo.find({});
    // Return the updated list
    res.json(updatedTodos);
  } catch (error) {
    res.status(500).send(error.toString());
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

// Delete a Todo item.
app.delete('/api/todos/:id', async (req, res) => {
  try {
    console.log( req.params.id )
    const todos = await Todo.findByIdAndDelete(req.params.id);
    if (!todos) {
      return res.status(404).json({ message: 'Cannot find todo item' });
    }
       // Fetch the updated list of todo items
       const updatedTodos = await Todo.find({});
       // Return the updated list
       res.json(updatedTodos);
  } catch (err) {
    console.error( err )
    res.status(500).json({ message: err.message });
  }
});


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));