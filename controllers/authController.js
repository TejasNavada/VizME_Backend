const authService = require('../services/authService')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const e = require('express')
const secret = process.env.JWT_SECRET
const { getUserById } = require('../services/userService')

async function register (req, res) {
  try {
    let user = await authService.register(req.body.user)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function validate (req, res) {
  jwt.verify(req.body.token, secret, async (err, decoded) => {
    if (err) {
      console.log('JWT ERROR:', err)
      res.status(401).send('Unauthorized')
    } else {
      const id = decoded.id
      try {
        const user = await getUserById(id)
        if (!user) {
          return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json(user)
        
        
      } catch (error) {
        throw error
      }
    }
  })
}


function login (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(400).send(info.message)
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }

      const token = jwt.sign({ id: user.userId}, secret, { expiresIn: '7d' })
      return res.json({ token })
    })
  })(req, res, next)
}

function logout (req, res) {
  req.logout()
}

module.exports = {
  register,
  login,
  logout,
  validate
}
