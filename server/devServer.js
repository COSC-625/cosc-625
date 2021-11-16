/////////////////////
//      SERVER     //
/////////////////////
import { join } from 'path';
import compression from 'compression';
const express = require('express');
const app = express();
const open = require('open');
const url = "http://localhost:";
const port = 3001 || process.env.PORT;

// Hot reloading for real-time updates during development.
import webpack from 'webpack';
import config from '../webpack.config.dev.js';
const compiler = webpack(config);
app.use(require("webpack-dev-middleware")(compiler, {
  publicPath: config.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler, {
  reload: true,
  path: '/__webpack_hmr'
}));

app.use(compression());
// Because we serve static files/pages, HTML updates will not hot reload.
// Manually refresh the page if you make edits to .html files.
app.use(express.static('./client/dist'));

// Get routes to individual pages.
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, './client/dist/index.html'));
});
app.get('/lobby', (req, res) => {
  res.sendFile(join(__dirname, './client/dist/lobby.html'));
});
app.get('/spGame', (req, res) => {
  res.sendFile(join(__dirname, './client/dist/spGame.html'));
});
app.get('/mpGame', (req, res) => {
  res.sendFile(join(__dirname, './client/dist/mpGame.html'));
});


//////////////////////
//    NETWORKING    //
//////////////////////
// create http server
const server = require('http').createServer(app);
// express instance passed into new socket.io instance
const socketio = require('socket.io')(server, {
  cors: {
    origin: url + port
  }
});
const users = {};

// changed from server.listen to httpserver.listen
server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is running port: " + port); // unnecessary
    open(url + port);
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
