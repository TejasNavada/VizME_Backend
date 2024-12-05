const db = require('../db')
const { getUserSubmissions } = require('../../services/problemService')

let isListening = false

const listenForMessage = async (io) => {
  try {
    const client = await db.connectionManager.getConnection()
    await client.query('LISTEN message_channel')
    console.log('Listening for messages...')
    isListening = true

    client.on('notification', async (msg) => {
      const payload = JSON.parse(msg.payload)
      console.log('Received message: ', payload)
      const receiverId = payload.data.receiver_id
      const senderId = payload.data.sender_id
      const problemId = payload.data.problemId
      io.to('problem '+problemId+ ' user ' + receiverId).emit('update message', payload)
      io.to('problem '+problemId+ ' user ' + senderId).emit('update message', payload)
      if(senderId!=1){
        let subs = await getUserSubmissions(problemId,senderId)
        if(subs?.length==1){
          io.to('submission ' + problemId).emit('update submission', subs[0])
        }
      }
      
      // io.to('groups ' + sessionId).emit('update message', payload)
    })

    client.on('end', async () => {
      console.log('Connection ended, attempting to reconnect...')
      isListening = false
      reconnect(io)
    })

  } catch (err) {
    console.error('Error in listening for submissions: ', err)
    reconnect(io)
  }
}

const reconnect = async (io) => {
  if (!isListening) {
    await new Promise(resolve => setTimeout(resolve, 5000))
    listenForMessage(io)
  }
}

module.exports = listenForMessage