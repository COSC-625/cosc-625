import webpack from 'webpack';
import config from '../webpack.config.dev.js';
import { join } from 'path';

const server = require('express')();
const open = require('open');
const port = 3001;
const compiler = webpack(config);

const httpserver = require('http').createServer(server);
const socket = require('socket.io')(httpserver);


server.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

server.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../client/src/index.html'));
});

httpserver.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is running port: " + port);
    open('http://localhost:' + port);
  }
});

socket.on("connection", (socket) => {
  console.log("Client connection successful!");
});
