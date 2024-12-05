const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()

router.post('/register', (req, res, next) => {
  return authController.register(req, res, next)
})
router.post('/login', authController.login)
router.post('/validate', authController.validate)

module.exports = router
