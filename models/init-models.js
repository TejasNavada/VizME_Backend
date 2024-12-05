var DataTypes = require("sequelize").DataTypes
var _message = require("./message")
var _problem = require("./problem")
var _submission = require("./submission")
var _submission_error = require("./error")
var _user = require("./user")
var _user_equation = require("./userEquation")
var _variable_constant = require("./variableConstant")
var _variable_equation = require("./variableEquation")
var _variable_range = require("./variableRange")

const e = require("express")

function initModels (sequelize) {
  var message = _message(sequelize, DataTypes)
  var problem = _problem(sequelize, DataTypes)
  var submission = _submission(sequelize, DataTypes)
  var submission_error = _submission_error(sequelize, DataTypes)
  var user = _user(sequelize, DataTypes)
  var user_equation = _user_equation(sequelize, DataTypes)
  var variable_constant = _variable_constant(sequelize, DataTypes)
  var variable_equation = _variable_equation(sequelize, DataTypes)
  var variable_range = _variable_range(sequelize, DataTypes)


  return {
    message,
    submission,
    submission_error,
    user,
    problem,
    user_equation,
    variable_constant,
    variable_equation,
    variable_range
  }
}
module.exports = initModels
module.exports.initModels = initModels
module.exports.default = initModels
