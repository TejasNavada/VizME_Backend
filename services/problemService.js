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
WITH RecentSubmissions AS (
    SELECT 
        "userId", 
        "pass", 
        "created_time",
		"submissionId",
		"problemId",
        ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "created_time" DESC) AS row_num
    FROM 
        submissions
    WHERE 
        "problemId" = :problemId AND "userId" <> 1
),
SubmissionCounts AS (
    SELECT 
        "userId",
        COUNT(*) AS "num_subs"
    FROM 
        submissions
    WHERE 
        "problemId" = :problemId AND "userId" <> 1
    GROUP BY 
        "userId"
),
MessageCounts AS (
    SELECT 
        sender_id AS "userId",
        COUNT(*) AS "num_messages"
    FROM 
        messages
    WHERE 
        "problemId" = :problemId AND sender_id <> 1
    GROUP BY 
        sender_id
),
AllUsers AS (
    SELECT DISTINCT "userId" FROM submissions WHERE "problemId" = :problemId AND "userId" <> 1
    UNION
    SELECT DISTINCT sender_id AS "userId" FROM messages WHERE "problemId" = :problemId AND sender_id <> 1
)
SELECT 
    au."userId",
    rs."pass",
    rs."created_time",
	rs."submissionId",
	rs."problemId",
    COALESCE(sc."num_subs", 0) AS "num_subs",
    COALESCE(mc."num_messages", 0) AS "num_messages"
FROM 
    AllUsers au
LEFT JOIN 
    RecentSubmissions rs
ON 
    au."userId" = rs."userId" AND rs.row_num = 1
LEFT JOIN 
    SubmissionCounts sc
ON 
    au."userId" = sc."userId"
LEFT JOIN 
    MessageCounts mc
ON 
    au."userId" = mc."userId";


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
WITH RecentSubmissions AS (
    SELECT 
        "userId", 
        "pass", 
        "created_time",
		"submissionId",
		"problemId",
        ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "created_time" DESC) AS row_num
    FROM 
        submissions
    WHERE 
        "problemId" = :problemId AND "userId" = :sender_id
),
SubmissionCounts AS (
    SELECT 
        "userId",
        COUNT(*) AS "num_subs"
    FROM 
        submissions
    WHERE 
        "problemId" = :problemId AND "userId" = :sender_id
    GROUP BY 
        "userId"
),
MessageCounts AS (
    SELECT 
        sender_id AS "userId",
        COUNT(*) AS "num_messages"
    FROM 
        messages
    WHERE 
        "problemId" = :problemId AND sender_id = :sender_id
    GROUP BY 
        sender_id
),
AllUsers AS (
    SELECT DISTINCT "userId" FROM submissions WHERE "problemId" = :problemId AND "userId" = :sender_id
    UNION
    SELECT DISTINCT sender_id AS "userId" FROM messages WHERE "problemId" = :problemId AND sender_id = :sender_id
)
SELECT 
    au."userId",
    rs."pass",
    rs."created_time",
	rs."submissionId",
	rs."problemId",
    COALESCE(sc."num_subs", 0) AS "num_subs",
    COALESCE(mc."num_messages", 0) AS "num_messages"
FROM 
    AllUsers au
LEFT JOIN 
    RecentSubmissions rs
ON 
    au."userId" = rs."userId" AND rs.row_num = 1
LEFT JOIN 
    SubmissionCounts sc
ON 
    au."userId" = sc."userId"
LEFT JOIN 
    MessageCounts mc
ON 
    au."userId" = mc."userId";

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
