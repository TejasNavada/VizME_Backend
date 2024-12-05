
const setProblemSocket = (socket) => {
  socket.on('subscribe problem', (problemId) => {
    socket.join("problem " + problemId)
  })

  socket.on('unsubscribe problem', (problemId) => {
    if (socket.rooms.has("problem " + problemId)){
      socket.leave("problem " + problemId)
    }
  })
  socket.on('subscribe problems', () => {
    socket.join("problems")
  })
  socket.on('unsubscribe problems', () => {
    if (socket.rooms.has("problems")){
      socket.leave("problems")
    }
  })
}

module.exports = { setProblemSocket }