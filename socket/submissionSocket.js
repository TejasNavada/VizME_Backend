const setSubmissionSocket = (socket) => {
  socket.on('subscribe submissions', (problemId) => {
    socket.join("submission " + problemId)
  })

  socket.on('unsubscribe submissions', (problemId) => {
    if (socket.rooms.has("submission " + problemId))
      socket.leave("submission " + problemId)
  })
}

module.exports = { setSubmissionSocket }
