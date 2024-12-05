const chatService = require("../services/chatService")

exports.sendMessage = async (req, res, next) => {
	try {
		const message = await chatService.sendMessage(req.body)
		res.json({ message: message })
	} catch (err) {
		next(err)
	}
}

exports.sendMessageToAI = async (req, res, next) => {
	try {
		const message = await chatService.sendMessageToAI(req.body.messages)
		res.json({ message: message })
	} catch (err) {
		next(err)
	}
}

exports.getMessagesByProblemAndUser = async (req, res, next) => {
	try {
		const messages = await chatService.getMessagesByProblemAndUser(req.params.problemId,req.params.userId)
		res.json({ messages: messages })
	} catch (err) {
		next(err)
	}
}



exports.getMessagesByProblem = async (req, res, next) => {
	try {
		const messages = await chatService.getMessagesByProblem(req.params.problemId)
		res.json({ messages: messages })
	} catch (err) {
		next(err)
	}
}
