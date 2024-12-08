const express = require('express');
const server = require('http').createServer();

const app = express();

app.get('/', function(req, res){
    res.sendFile('index.html', {root: __dirname});
})

server.on('request', app);
server.listen(3000, function(){
    console.log("Server started on port 3000");
})

/**Begin websocket */

const WebsocketServer = require('ws').Server;

const wss = new WebsocketServer({server: server});

wss.on('connection', function connection(ws){
    const numCLients = wss.clients.size;
    console.log('Clients connected', numCLients);

    wss.broadcast(`Current visitors: ${numCLients}`);
    // Sockets have open, close and errored

    if(ws.readyState === ws.OPEN){
        ws.send('Welcome to my server');
    }

    ws.on('close', function close(){
        wss.broadcast(`Current visitors: ${numCLients}`);
        console.log('A client has disconnected');
    })

    ws.on('error', function error() {
        //
      });
})

wss.broadcast = function broadcast(data) {
    console.log('Broadcasting: ', data);
    wss.clients.forEach(function each(client) {
      client.send(data);
    });
  };
  