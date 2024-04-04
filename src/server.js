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


// // Create a new Todo item
// app.post('/api/todos', async (req, res) => {
//   const { title, description , location, reminderDate, photoUri } = req.body;
//   try {
//     let cloudinaryUrl = await uploadImage( photoUri );

//     console.log( cloudinaryUrl );
  
//     const todo = new Todo({
//       title,
//       description,
//       location, reminderDate,
//       photoUri: cloudinaryUrl
//     });
  
//     await todo.save();
//     // Fetch the updated list of todo items
//     const newTodos = await Todo.find({});
//     // Send the updated list of todo items back to the client
//     res.json( newTodos );
//   } catch (err) {
//     console.log( 'err' )
//     res.status(400).json({ message: err });
//   }
// });


//todos without picture

app.post('/api/todos', async (req, res) => {
  const { title, description, location, reminderDate, photoUri } = req.body;

  let cloudinaryUrl = ""; // Initialize with a default or empty string
  // Only attempt to upload if photoUri is provided
  if (photoUri) {
    try {
      cloudinaryUrl = await uploadImage(photoUri);
      console.log(cloudinaryUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
      // Optionally, handle the error, e.g., by sending a response or logging
    }
  }

  try {
    const todo = new Todo({
      title,
      description,
      location,
      reminderDate,
      photoUri: cloudinaryUrl // This will be an empty string if photoUri was not provided
    });

    await todo.save();
    // Fetch the updated list of todo items
    const newTodos = await Todo.find({});
    // Send the updated list of todo items back to the client
    res.json(newTodos);
  } catch (err) {
    console.log('Error saving todo:', err);
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