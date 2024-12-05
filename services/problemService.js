const sequelize = require("../postgre/db")
const initModels = require("../models/init-models")
const Problem = initModels(sequelize).problem
const Variable_Range = initModels(sequelize).variable_range
const Variable_Constant = initModels(sequelize).variable_constant
const Variable_Equation = initModels(sequelize).variable_equation
const Message = initModels(sequelize).message
const Submission = initModels(sequelize).submission
const { deleteSubmissionById } = require('../services/submissionService')



exports.list = async () => {
	try {
		return await Problem.findAll({
			order: [['problemName','DESC']]
		})
	} catch (err) {
		console.log(err)
		throw err
	}
}

exports.createProblem = async (problem) => {
	try {
		
		let variables = problem.variables
		delete problem.variables
		console.log(problem)
		console.log(variables)
		let newProblem = await Problem.create(problem)
		for(let i = 0; i < variables.length; i++){
			variables[i].problemId = newProblem.problemId
			if(variables[i].type == "Constant"){
				await Variable_Constant.create(variables[i])
			}
			else if(variables[i].type == "Random"){
				await Variable_Range.create(variables[i])
			}
			else if(variables[i].type == "Equation"){
				await Variable_Equation.create(variables[i])
			}
		}
		return newProblem
	} catch (err) {
		console.log(err)
	}
}

exports.getProblemById = async (id) => {
	try {
		let problem = await Problem.findByPk(id)
		return problem
	} catch (err) {
		console.log(err)
	}
}

exports.getVariablesByProblemId = async (id) => {
	try {
		let ranges = await Variable_Range.findAll({
			where: {
				problemId: id
			}
		})
		let constants = await Variable_Constant.findAll({
			where: {
				problemId: id
			}
		})
		let equations = await Variable_Equation.findAll({
			where: {
				problemId: id
			}
		})
		return [...ranges,...constants,...equations]
	} catch (err) {
		console.log(err)
	}
}

exports.deleteProblemById = async (id) => {
	try {
		await Variable_Constant.destroy({
			where: { problemId: id }
		})
		await Variable_Range.destroy({
			where: { problemId: id }
		})
		await Variable_Equation.destroy({
			where: { problemId: id }
		})
		await Message.destroy({
			where: { problemId: id }
		})
		let submissions = await Submission.findAll({
			where: { problemId: id }
		})
		console.log(submissions)
		let result = await Promise.all(submissions.map((sub) => {
			return deleteSubmissionById(sub.submissionId)
		}));
		console.log(result)
		await Problem.destroy({
			where: { problemId: id }
		})




	} catch (err) {
		console.log(err)
	}
}

exports.updateProblem = async (id, problem) => {
	try {
		const updatedProblem = await Problem.update(problem, {
			where: { problemId: id },
			returning: true,
		})
		return updatedProblem
	} catch (err) {
		console.log(err)
	}
}

exports.getSubmissions = async (problemId) => {
	try {
		const [results, metadata] = await sequelize.query(
			`
SELECT s1.*, s2.num_subs, m1.num_messages
FROM submissions AS s1
JOIN (
SELECT "userId", MAX(created_time) AS max_created_time, COUNT("userId") as num_subs
FROM submissions
WHERE "problemId" = :problemId
GROUP BY "userId"
) AS s2 ON s1."userId" = s2."userId" AND s1.created_time = s2.max_created_time
LEFT OUTER JOIN (
SELECT sender_id, COUNT(sender_id) as num_messages
from messages
WHERE "problemId" = :problemId
GROUP BY sender_id
) AS m1 ON s1."userId" = m1.sender_id
WHERE s1."problemId" = :problemId
    `,
			{
				replacements: { problemId: problemId },
			}
		)
		console.log(metadata)
		console.log(results)
		console.log(problemId)
		return results
	} catch (err) {
		console.error(err)
	}
}

exports.getUserSubmissions = async (problemId,userId) => {
	try {
		const [results, metadata] = await sequelize.query(
			`
SELECT s1.*, s2.num_subs, m1.num_messages
FROM submissions AS s1
JOIN (
SELECT "userId", MAX(created_time) AS max_created_time, COUNT("userId") as num_subs
FROM submissions
WHERE "problemId" = :problemId AND "userId" = :userId
GROUP BY "userId"
) AS s2 ON s1."userId" = s2."userId" AND s1.created_time = s2.max_created_time
LEFT OUTER JOIN (
SELECT sender_id, COUNT(sender_id) as num_messages
from messages
WHERE "problemId" = :problemId AND "sender_id" = :userId
GROUP BY sender_id
) AS m1 ON s1."userId" = m1.sender_id
WHERE s1."problemId" = :problemId AND s1."userId" = :userId
    `,
			{
				replacements: { problemId: problemId,userId:userId },
			}
		)
		console.log(metadata)
		console.log(results)
		console.log(problemId)
		return results
	} catch (err) {
		console.error(err)
	}
}
