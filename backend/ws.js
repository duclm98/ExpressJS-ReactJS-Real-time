const WebSocket = require('ws');

const SK_PORT = 40510;
let socketServer;

if (!socketServer) {
  socketServer = new WebSocket.Server({
    port: SK_PORT
  });

  socketServer.on('connection', function (client_socket) {
    client_socket.on('message', function incoming(message) {
      console.log(`received: ${message}`);
    });

    // client_socket.send('connected');
  })

  console.log(`WebSocket Server running at port ${SK_PORT}`);
}

function broadcastAll(msg) {
  for (const c of socketServer.clients) {
    // console.log(c.readyState);
    if (c.readyState === WebSocket.OPEN) {
      c.send(msg);
    }
  }
}

module.exports = {
  socketServer,
  broadcastAll
};