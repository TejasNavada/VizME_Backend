const sequelize = require("../postgre/db")
const { Op } = require("sequelize")
const initModels = require("../models/init-models")

const Message = initModels(sequelize).message
const Problem = initModels(sequelize).problem
const User = initModels(sequelize).user
const azureApiKey = process.env.UNI_AZURE_OPENAI_API_KEY
const endpoint = "https://itls-openai-connect.azure-api.net/deployments/gpt-35-turbo/chat/completions?api-version=2023-12-01-preview"

const { OpenAI } = require("openai")
const openai = new OpenAI(process.env.OPENAI_API_KEY)

exports.sendMessage = async (messageReq) => {
	const { problemId, sender_id, receiver_id, content } = messageReq

	//console.log(messageReq)
	const messageData = {
		problemId,
		sender_id,
		receiver_id,
		content,
		created_time: new Date(),
	}

	try {
		const messages = await Message.create(messageData)
		return messages
	} catch (err) {
		console.log(err)
		return err
	}
}
exports.sendMessageToAI = async (messages) => {

	for(let i = 0; i < messages.length; i++){
		if(messages[i]?.role=="system"){

		}
		else if(messages[i].sender_id==1){
			messages[i].role="assistant"
		}
		else{
			messages[i].role="user"
		}
		//console.log(messages[i].content)
	}
	if(messages[0]?.role!="system"){
		
		let prob = Problem.findByPk(messages[0].problemId)
		messages[0].content = [
			{"type": "text", "text": messages[0].content},
			{
				"type": "image_url",
				"image_url": {
					"url": prob.image,
					"detail": "low"
				},
			},
		]
		messages = [{"role":"system", "content":[
			{"type": "text", "text": "You will help a student in their Mechanical Engineering task: "+prob.statement},
		  ]},...messages]
	}
	
	//console.log(messages)
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: messages,
		  }
		)
		return response.choices[0].message
	} catch (err) {
		console.log(err)
		return err
	}
}

exports.getMessagesByProblemAndUser = async (problemId,userId) => {
	try {
		return await Message.findAll({
			where: {
				problemId: problemId,
				[Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
			},
			order: [["created_time", "ASC"]],
		})
	} catch (err) {
		console.log(err)
		throw err
	}
}


exports.getMessagesByProblem = async (problemId) => {
	try {
		return await Message.findAll({
			where: {
				[Op.and]: [{ [Op.or]: [{ problemId: problemId }] }],
			},
			order: [["created_time", "ASC"]],
		})
	} catch (err) {
		console.log(err)
		throw err
	}
}
