///////////////////
//    EXPRESS    //
///////////////////

import { join } from 'path';
import compression from 'compression';
const express = require('express');
const app = express();
const cors = require("cors");
const open = require('open');

// URL.
const url = "http://localhost:";
const port = 3001 || process.env.PORT;
const localhost = url + port;

// Base webpack configs.
import webpack from 'webpack';
import config from '../webpack.config.dev.js';
const compiler = webpack(config);

// Setup for dev server.
app.use(require("webpack-dev-middleware")(compiler, {
  publicPath: config.output.publicPath
}));
app.use(cors());
app.use(compression());
app.use(express.static('./client/dist'));

// Get routes to individual HTML pages.
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


/////////////////////
//    SOCKET.IO    //
/////////////////////

// Import in-memory storage functions.
const { addUser,
        deleteUser,
        deleteRoom,
        GetUsers } = require('../client/src/js/users.js');

// Create http server.
const server = require('http').createServer(app);
// Express instance passed into new socket.io instance.
// Define CORS to allow any connection.
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});

// SOCKET CONNECTION ESTABLISHED FROM CLIENT.
io.on("connection", (socket) => {
  // When a user connects.
  socket.on('joined-user', () => {
    // Update handshake object with socket ID and user list for that room.
    socket.handshake.auth.userID = socket.id;
    // Add user to in-memory storage.
    addUser(socket.handshake.auth.roomID,
            socket.handshake.auth.userID,
            socket.handshake.auth.username);
    // Populate user list.
    socket.handshake.auth.users = GetUsers(socket.handshake.auth.roomID);

    // Connect socket to room.
    socket.join(socket.handshake.auth.roomID);

    // FOR TESTING DURING DEVELOPMENT.
    // Console log socket user details.
    // socket.emit('console', {msg: "RoomID: " + socket.handshake.auth.roomID});
    // socket.emit('console', {msg: "Username: " + socket.handshake.auth.username});
    // socket.emit('console', {msg: "userID: " + socket.handshake.auth.userID});

    // Emit joined message.
    io.to(socket.handshake.auth.roomID).emit('joined', ({
            username: socket.handshake.auth.username,
            users: socket.handshake.auth.users
          }));
  });

  // When client side sends share-msg, emit back message with username.
  socket.on('share-msg', msg => {
    // Send both username and message to the group chat.
    io.to(socket.handshake.auth.roomID).emit('msg', ({
        message: msg,
        username: socket.handshake.auth.username
      }));
  });

  // On Disconnect.
  socket.on("disconnect", () => {
    let loc = '';
    io.to(socket.handshake.auth.roomID).emit('getLocation');
    socket.on('location', loc => {
      loc = loc;
    });
    if (loc == 'lobby') {
      // If we're exiting from the lobby, maintain storage of user data.
      // Notify other users of disconnection.
      // TODO: Get persistent user storage to function. This does not work as we want yet.
      io.to(socket.handshake.auth.roomID).emit("disconnected", ({
            username: socket.handshake.auth.username,
            users: users
          }));
    } else {
      // If the user exits from the game, delete them from storage.
      deleteUser(socket.handshake.auth.roomID, socket.handshake.auth.userID);
      let users = GetUsers(socket.handshake.auth.roomID);
      if (users.length === 0) {
        // Delete room if all users are disconnected.
        deleteRoom(socket.handshake.auth.roomID);
      } else {
        // Notify other users of disconnection.
        io.to(socket.handshake.auth.roomID).emit("disconnected", ({
              username: socket.handshake.auth.username,
              users: users
            }));
      }
    }
  });

  // FOR TESTING DURING DEVELOPMENT.
  // Console log data from socket room creation and users joining.
  // io.of('/').adapter.on('create-room', (room) => {
  //   let message = `room ${room} was created.`;
  //   socket.emit('console', {msg: message});
  // });
  // io.of('/').adapter.on('join-room', (room, id) => {
  //   let message = `socket ${id} has joined room ${room}.`;
  //   socket.emit('console', {msg: message});
  // });

}); // End of io.on('connection').

// Instantiate server, listening on the defined port.
server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    // Open default browser with running application.
    open(localhost);
  }
});
