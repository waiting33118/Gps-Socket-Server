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
      io.in('home').emit('newDrone', newGuestBroadcast(id, clientConnections))
    })
    socket.on('disconnect', () => {
      clientConnections.pop()
      io.in('home').emit('droneDisconnect', leaveBroadcast(clientConnections))
    })
    socket.on('sendCoords', (data) => {
      io.in('home').emit('sendCoords', sendCoords(data))
    })
    socket.on('stopSending', () => {
      console.log('===Gps tracking stopped!===')
      io.in('home').emit('stopSending')
    })
  })

  function newGuestBroadcast (clientId, connections) {
    const droneCounts = connections.length.toString()
    console.log(`|New Connection| Client ID: ${clientId}\nTotal connections: ${droneCounts}`)
    console.log(new Date().toString())
    return {
      clientId, droneCounts
    }
  }
  function leaveBroadcast (connections) {
    const droneCounts = connections.length.toString()
    console.log(`|Disconnected| Connections: ${droneCounts}`)
    console.log(new Date().toString())
    return {
      droneCounts
    }
  }
  function sendCoords (coords) {
    console.log(coords)
    return [coords.longitude, coords.latitude]
  }
}

module.exports = socketConfig
