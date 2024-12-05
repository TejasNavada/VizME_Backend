const db = require('../db')

let isListening = false

const listenForProblem = async (io) => {
  try {
    const client = await db.connectionManager.getConnection()
    //console.log(client)
    let result = await client.query('LISTEN problem_channel')
    //console.log(result)
    console.log('Listening for problems...')
    isListening = true

    client.on('notification', async (msg) => {
      console.log(msg)
      const payload = JSON.parse(msg.payload)
      console.log('Received problem: ', payload)
      const problemId = payload.data.problemId
      io.to('problem ' + problemId).emit('update problem', payload)
      io.to('problems').emit('update problems', payload)
    })

    client.on('end', async () => {
      console.log('Connection ended, attempting to reconnect...')
      isListening = false
      reconnect(io)
    })

  } catch (err) {
    console.error('Error in listening for problems: ', err)
    reconnect(io)
  }
}

const reconnect = async (io) => {
  if (!isListening) {
    await new Promise(resolve => setTimeout(resolve, 5000))
    listenForProblem(io)
  }
}

module.exports = listenForProblem