const express = require("express")
const router = express.Router()
const ChatController = require("../controllers/chatController")


router.post("/", (req, res, next) => {
	return ChatController.sendMessage(req, res, next)
})

router.post("/ai", (req, res, next) => {
	return ChatController.sendMessageToAI(req, res, next)
})

router.get("/problem/:problemId/user/:userId", (req, res, next) => {
	return ChatController.getMessagesByProblemAndUser(req, res, next)
})

router.get("/problem/:problemId", (req, res, next) => {
	return ChatController.getMessagesByProblem(req, res, next)
})
module.exports = router
