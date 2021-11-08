/////////////////////
//   BASE CONFIG   //
/////////////////////
import { join } from 'path';
import compression from 'compression';

const express = require('express');
const server = express();
const open = require('open');
const port = 3001;

server.use(compression());
server.use(express.static('./client/dist'));

// Get routes to individual pages.
server.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
});
server.get('/game', (req, res) => {
  res.sendFile(join(__dirname, './client/dist/game.html'));
});

//////////////////////
//    NETWORKING    //
//////////////////////
server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    open('http://localhost:' + port);
  }
});
