const { getUserSubmissions } = require('../../services/problemService')
const db = require('../db')

const listenForSubmissions = async (io) => {
  try {
    const client = await db.connectionManager.getConnection()
    await client.query('LISTEN submission_channel')
    console.log('Listening for submissions...')
    let isListening = true

    client.on('notification', async (msg) => {
      let payload = JSON.parse(msg.payload)
      console.log('Received submission: ', payload)
      const problemId = payload.data.problemId
      let subs = await getUserSubmissions(payload.data.problemId,payload.data.userId)
      console.log(subs)
      console.log(payload)
      io.to('submission ' + problemId).emit('update submission', subs[0])
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
  await new Promise(resolve => setTimeout(resolve, 5000)) // Wait for 5 seconds before reconnecting
  listenForSubmissions(io)

}

module.exports = listenForSubmissions