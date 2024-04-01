const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  reminderDate: {
    type: Date, // Adding the reminderDate field
    required: false // This makes the field optional, change to `true` if it should be required
  },
  photoUri: {
    type: String
  }
});

module.exports = mongoose.model('todo', TodoSchema);
