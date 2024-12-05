const setMessageSocket = (socket) => {
    socket.on('subscribe message', (problemId, userId) => {
      console.log('Subscribing to message from problem ' + problemId + ' and user '+ userId)
      socket.join("problem " + problemId + " user " + userId)
    })
    
    socket.on('unsubscribe message', (problemId, userId) => {
      if (socket.rooms.has("problem " + problemId + " user " + userId))
        socket.leave("problem " + problemId + " user " + userId)
    })
  }
  
  module.exports = { setMessageSocket }
  