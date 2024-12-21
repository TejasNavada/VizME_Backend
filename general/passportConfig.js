const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const initModels = require("../models/init-models")
const sequelize = require('../postgre/db')
const User = initModels(sequelize).user;
const authService = require('../services/authService')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await authService.validatePassword(email, password)
      if (!user) {
        return done(null, false, { message: 'Incorrect password.' })
      }
      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }
))

passport.serializeUser((user, done) => {
  console.log(user)
  done(null, user.userId)
})

passport.deserializeUser(async (id, done) => {
  try {
    const student = await User.findByPk(id)
    done(null, student)
  } catch (error) {
    done(error)
  }
})

module.exports = passport
