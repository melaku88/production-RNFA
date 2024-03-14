const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username:{
    type: String,
    required: [true, 'please add name'],
    unique: true,
    trim: true
  },
  email:{
    type: String,
    required: [true, 'please add email'],
    unique: true,
    trim: true
  },
  password:{
    type: String,
    required: [true, 'please add password'],
    min: 6,
    max: 64
  },
  answer:{
    type: String,
    required: [true, 'please add email'],
    trim: true
  },
  role:{
    type: String,
    default: 'user'
  }
}, {timestamps: true})

module.exports = mongoose.model('users', UserSchema)