import webpack from 'webpack';
import config from '../webpack.config.dev.js';
import { join } from 'path';

const server = require('express')();
const open = require('open');
const port = 3001;
const compiler = webpack(config);

// create http server
const httpserver = require('http').createServer(server);
// express instance passed into new socket.io instance
const socketio = require('socket.io')(httpserver);
const users = {};

server.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

server.use(require('webpack-hot-middleware')(compiler, {
  reload: true
}));

server.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
});

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
  });
});
