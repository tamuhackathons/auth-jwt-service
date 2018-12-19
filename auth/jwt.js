const mongoose = require('mongoose')
const passportJWT = require('passport-jwt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const { databaseConnectionOptions, databaseConnectionError } = require('../config')

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, databaseConnectionOptions, databaseConnectionError)

var JwtStrategy = passportJWT.Strategy
var ExtractJwt = passportJWT.ExtractJwt

var jwtOptions = {
  jwtFromRequest: ExtractJwt.fromBodyField('jwtToken'),
  secretOrKey: process.env.TOKEN_SECRET
}

var jwtStrategy = new JwtStrategy(jwtOptions, function (jwtPayload, next) {
  User.findById(jwtPayload.id, (err, user) => {
    if (err) {
      return next(err, false)
    }
    if (user) {
      return next(null, user)
    } else {
      return next(null, false)
    }
  })
})

/*
@param  {mongoose.Schema.Types.ObjectId}    userId  The _id of the user from the database
@return {String}                            token   the signed JWT Token
*/
async function createToken (userId) {
  let payload = {
    id: userId
  }
  try {
    let token = await jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPR })
    return token
  } catch (err) {
    console.log('JWT ERROR:', err)
    return null
  }
}

module.exports = {
  jwtStrategy,
  createToken
}
