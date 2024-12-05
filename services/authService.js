const bcrypt = require('bcrypt')
const sequelize = require("../postgre/db")
const initModels = require("../models/init-models")
const User = initModels(sequelize).user
const Op = require('sequelize').Op;
const { getUserByEmail } = require('./userService')
var CryptoJS = require("crypto-js");
var iv  = CryptoJS.enc.Utf8.parse('1583288699248111');

async function hashPassword (password) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

function decrypt(value) {
  try {
		const decrypted = CryptoJS.AES.decrypt(value, process.env.JWT_SECRET);
		if (decrypted) {
			try {
				const str = decrypted.toString(CryptoJS.enc.Utf8);
        console.log("str",str)
				if (str.length > 0) {
          
					return str
				} else {
					return 'error 1';
				} 
			} catch (e) {
				return 'error 2';
			}
		}
		return 'error 3';
	} catch (err) {
		console.error("Error retrieving users by group:", err);
	}
}

async function validatePassword (email, plainPassword) {
  const students = await User.findAll({ where: {email: {[Op.ne]: null}}})
  let student = students.find((element) => element.email===email);
  const hashedPassword = student.password
  const isValid = await bcrypt.compare(plainPassword, hashedPassword)
  if (isValid) {
    const studentWithoutPassword = { ...student.toJSON() }
    delete studentWithoutPassword.password
    return studentWithoutPassword
  } else {
    return false
  }
}

async function register (instructor) {
  instructor.password = await hashPassword(instructor.password)
  try {
    const res = await User.create(instructor)
    return res
  } catch (error) {
    throw new Error(error)
  }
}






function logout (req, res) {
  req.logout()
}

module.exports = {
  hashPassword,
  validatePassword,
  register,
  logout
}
