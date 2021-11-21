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

// Create http server.
const server = require('http').createServer(app);
// Express instance passed into new socket.io instance.
const socketio = require('socket.io')(server, {
  cors: {
    origin: url + port
  }
});

// Pulling sessionStorage functions in from sessionStore.js.
const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();

// Middleware function for authenticating user when reconnecting or
// creating new sessionID and userID if session doesn't exist.
socketio.use((socket, next) => {
  const sessionID = socket.handshake.auth.token;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    // If the session exists, attach it to socket.
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      // Exit out of middleware.
      return next();
    }
    // If the session doesn't exist, create a new one.
    else {
      // Fetch username from handshake object on client-side.
      const username = socket.handshake.query.username;
      if (!username) {
        // Exit middleware if no username is set.
        return next(new Error("Missing username"));
      }
      socket.sessionID = sessionID;
      socket.userID = Math.round(Math.random() * 100000);
      socket.username = username;
      next();
    }
  } else {
    // Exit middleware. This should never happen (theoretically).
    next();
  }

});

// Connection listener.
socketio.on("connection", (socket) => {
  console.log("Client connection successful!");

  // Persist the session.
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true
  });

  // Notify users of joined user.
  socket.on('joined-user', username => {
    socket.broadcast.emit('joined', username);
  });

  // Emit session details.
  socket.emit("the-session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  // join the userID room.
  socket.join(socket.userID);

  // fetch users.
  const users = [];
  sessionStore.findAllSessions().forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected
    });
  });
  socket.emit('users', users);

  // notify existing users.
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true
  });

  socket.on('share-msg', message => {
    console.log(message);
    //send both username and message to the client
    socket.broadcast.emit('msg', {message: message, username: socket.username});
  });

// disconnect listener
  socket.on('disconnect', async () => {
    const matchingSockets = await socketio.in(socket.userID).allSockets();
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
