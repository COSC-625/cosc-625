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
const cors = require("cors");


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

app.use(cors());
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

// Create http server.
const server = require('http').createServer(app);
// Express instance passed into new socket.io instance.
const io = require('socket.io')(server, {
  cors: {
    origin: url + port
  }
});

// Pulling session storage functions in from sessionStore.js.
const { InMemorySessionStore } = require("./sessionStore.js");
const sessionStore = new InMemorySessionStore();

// Register middleware function for authenticating user when reconnecting or
// creating new sessionID and userID if session doesn't exist.
// THIS ISN'T RUN INSTANTLY. IT REGISTERS A MIDDLEWARE THAT IS TRIGGERED
// WHEN A CONNECTION IS MADE.
io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    // If the session exists, attach it to socket.
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
    // If the session doesn't exist, attach a new one.
    else {
      // Fetch username and userID from handshake object.
      const username = socket.handshake.auth.username;
      const userID = socket.handshake.auth.userID;
      if (!username) {
        return next(new Error("Missing username"));
      }
      if (!userID) {
        return next(new Error("Missing userID"));
      }
      socket.sessionID = sessionID;
      socket.userID = userID;
      socket.username = username;
      next();
    }
  }
  else {
    // Create anonymous user session.
    socket.sessionID = Math.round(Math.random() * 100000);
    socket.userID = Math.round(Math.random() * 100000);
    socket.username = "Anonymous (UserID: " + socket.userID + ")";
    next();
  }
});

// Connection listener.
io.on("connection", (socket) => {
  // THE REGISTERED MIDDLEWARE ABOVE RUNS FIRST THING AFTER THIS CONNECTION
  // AND POPULATES THE SOCKET INSTANCE VALUES.

  console.log("Client connection successful!");
  console.log("Socket data on connection: " + socket);

  // Populate list of existing users.
  const userList = getUsers;

  // Persist the session in server-side memory.
  // TODO: Check that session values are not overwritten when multiple people join.
  // TODO: It's possible the username/userID combo need to be pushed onto an array
  //        that is attached to the sessionID instead of written as below.
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
    userList: userList
  });

  // Emit session details.
  socket.emit("the-session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
    username: socket.username,
    userList: userList
  });

  // Listen for users joining this socket instance.
  socket.on('joined-user', username => {
    // Join the user's socket instance to the sessionID chat room.
    socket.join(socket.sessionID);
    // Emit the message to the session's 'room'.
    io.to(socket.sessionID).emit('joined', username);
  });
  socket.emit('users', userList);

  // Fetch all session-based users.
  function getUsers() {
    const users = [];
    sessionStore.findAllSessions().forEach((session) => {
      users.push({
        userID: session.userID,
        username: session.username,
        connected: session.connected
      });
    });
    return users;
  }

  // socket.emit('users', users);

  // notify existing users.
  // socket.broadcast.emit("user connected", {
  //   userID: socket.userID,
  //   username: socket.username,
  //   connected: true
  // });

  socket.on('share-msg', (message, username) => {
    console.log(message);
    //send both username and message to the client
    socket.broadcast.emit('msg', {message: message, username: username});
  });

// disconnect listener
  socket.on('disconnect', async () => {
    const matchingSockets = await io.in(socket.sessionID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users.
      socket.broadcast.emit("disconnected", socket.userID);
      // update the connection status of the session.
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false
      });
    }
    //console.log('Client now disconnected.');
    //delete users[socket.id];
    //socket.broadcast.emit('disconnected', users[socket.id]);
  });
});

// Moved listen function to bottom.
server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is running port: " + port);
    // Open browser with running application.
    open(url + port);
  }
});
