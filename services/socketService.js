
const { setProblemSocket } = require("../socket/problemSocket")
const { setSubmissionSocket } = require("../socket/submissionSocket")
const { setMessageSocket } = require("../socket/messageSocket")

const socketManager = io => {
  io.on('connect', socket => {
    console.log('New client connected:', socket.id)

    setProblemSocket(socket)
    setSubmissionSocket(socket)
    setMessageSocket(socket)

    socket.on("disconnecting", async (reason) => {
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })
}

module.exports = { socketManager }
