const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
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
  }
})

// hash password before saving it to the database. TODO: Encrypt the all the data after hashing
UserSchema.pre('save', function (next) {
  var user = this
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