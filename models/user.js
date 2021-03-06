const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

mongoose.set('useCreateIndex', true)

var UserSchema = new mongoose.Schema({
  _id: String,
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: false,
    trim: true
  },
  firstname: {
    type: String,
    required: false,
    trim: true
  },
  lastname: {
    type: String,
    required: false,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    required: false,
    default: Date.now
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  verified: {
    type: Boolean,
    default: false
  }
})

// hash password before saving it to the database. TODO: Encrypt the all the data after hashing
UserSchema.pre('save', function (next) {
  let user = this
  bcrypt.hash(user.password, 12, function (err, hash) {
    if (err) {
      return err
    }
    user.password = hash
    next()
  })
})

var User = mongoose.model('User', UserSchema)

module.exports = User
