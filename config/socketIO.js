const socketConfig = (https) => {
  const io = require('socket.io')(https)

  io.on('connection', (socket) => {
    socket.join('home')
  })

  const clientNameSpace = io.of('/client')
  const clientConnections = []
  clientNameSpace.on('connection', (socket) => {
    socket.on('userId', (id) => {
      clientConnections.push(id)
      clientNameSpace.emit('newDrone', newGuestBroadcast(id, clientConnections))
      io.in('home').emit('newDrone', newGuestBroadcast(id, clientConnections))
    })
    socket.on('disconnect', () => {
      clientConnections.pop()
      clientNameSpace.emit('droneDisconnect', leaveBroadcast(clientConnections))
      io.in('home').emit('droneDisconnect', leaveBroadcast(clientConnections))
    })
  })

  function newGuestBroadcast (id, arr) {
    console.log(`|New Connection| Client ID: ${id}\nTotal connections: ${arr.length}`)
    return { id, arr }
  }
  function leaveBroadcast (arr) {
    console.log(`|Disconnected| Connections: ${arr.length}`)
    return { arr }
  }
}

module.exports = socketConfig
