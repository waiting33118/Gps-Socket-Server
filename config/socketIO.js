const socketConfig = (https) => {
  const io = require('socket.io')(https)
  // const layoutNameSpace = io.of('/layout')
  const clientNameSpace = io.of('/client')

  const clientConnections = []
  clientNameSpace.on('connection', (socket) => {
    socket.on('userId', (id) => {
      clientConnections.push(id)
      console.log(`|New Connection| Client ID: ${id}\nTotal connections: ${clientConnections.length}`)
    })
    socket.on('coords', (coords) => {
      console.log(coords)
      socket.emit('coords', coords)
    })
    socket.on('disconnect', () => {
      clientConnections.pop()
      console.log(`|Disconnected| Connections: ${clientConnections.length}`)
    })
  })
}

module.exports = socketConfig
