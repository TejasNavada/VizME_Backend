const userService = require('../services/userService')

exports.list = async (req, res, next) => {
  try {
    const users = await userService.list()
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

exports.getUsersByIds = async (req, res, next) => {
  try {
    const users = await userService.getUsersByIds(req.body.ids)
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body.user)
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id,req.body.user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    next(error)
  }
}

exports.getUserByEmail = async (req, res, next) => {
  try {
    const user = await userService.getUserByEmail(req.body.email)
    res.status(200).json(user)
  } catch (error) {
    console.error(error);
    next(error)
  }
}
exports.getUserStats = async (req, res, next) => {
  try {
    const stats = await userService.getUserStats(req.params.id)
    res.status(200).json(stats)
  } catch (error) {
    next(error)
  }
}