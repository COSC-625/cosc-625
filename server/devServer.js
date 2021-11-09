/////////////////////
//      SERVER     //
/////////////////////
import { join } from 'path';
import compression from 'compression';

const express = require('express');
const server = express();
const open = require('open');
const port = 3001 || process.env.PORT;

server.use(compression());
server.use(express.static('./client/dist'));

// Get routes to individual pages.
server.get('/', (req, res) => {
  res.sendFile(join(__dirname, './client/dist/index.html'));
});
server.get('/game', (req, res) => {
  res.sendFile(join(__dirname, './client/dist/game.html'));
});


//////////////////////
//    NETWORKING    //
//////////////////////
// create http server
const httpserver = require('http').createServer(server);
// express instance passed into new socket.io instance
const socketio = require('socket.io')(httpserver);
const users = {};

// changed from server.listen to httpserver.listen
httpserver.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is running port: " + port); // unnecessary
    open('http://localhost:' + port);
  }
});

// connect listener
socketio.on("connection", (socket) => {
  console.log("Client connection successful!");
  //socket.emit("chat-message", 'Testing');
  socket.on('joined-user', username => {
    users[socket.id] = username;
    socket.broadcast.emit('joined', username);
  });

  socket.on('share-msg', message => {
    console.log(message);
    //send both username and message to the client
    socket.broadcast.emit('msg', {message: message, username: users[socket.id]});
  });

// disconnect listener
  socket.on('disconnect', function() {
    console.log('Client now disconnected.');
    delete users[socket.id];
    socket.broadcast.emit('disconnected', users[socket.id]);
  });
});
