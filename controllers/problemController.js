const problemService = require("../services/problemService")

exports.list = async (req, res, next) => {
	try {
		const problems = await problemService.list()
		res.json({ problems: problems })
	} catch (err) {
		next(err)
	}
}

exports.createProblem = async (req, res, next) => {
	try {
		const problem = await problemService.createProblem(req.body.problem)
		res.json({ problem: problem })
	} catch (err) {
		next(err)
	}
}

exports.getProblemById = async (req, res, next) => {
	try {
		const problem = await problemService.getProblemById(req.params.id)
		res.json({ problem: problem })
	} catch (err) {
		next(err)
	}
}

exports.getVariablesByProblemId = async (req, res, next) => {
	try {
		const variables = await problemService.getVariablesByProblemId(req.params.id)
		res.json({ variables: variables })
	} catch (err) {
		next(err)
	}
}

exports.deleteProblemById = async (req, res, next) => {
	try {
		const problem = await problemService.deleteProblemById(req.params.id)
		res.json({ problem: problem })
	} catch (err) {
		next(err)
	}
}


exports.updateProblem = async (req, res, next) => {
	try {
		const problem = await problemService.updateProblem(
			req.params.id,
			req.body.problem
		)
		res.json({ problem: problem })
	} catch (err) {
		next(err)
	}
}
exports.getSubmissions = async (req, res, next) => {
	try {
		const submissions = await problemService.getSubmissions(req.params.id)
		res.json({ submissions: submissions })
	} catch (err) {
		next(err)
	}
}
