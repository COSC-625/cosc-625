const express = require('express');
const server = express();
const port = 3000;

import { join } from 'path';
//import express from 'express';
import open from 'open';
import compression from 'compression';

server.use(compression());
server.use(express.static('./client/dist'));

server.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
});

server.get('/game', (req, res) => {
  res.sendFile(join(__dirname, './client/dist/game.html'));
});

server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    open('http://localhost:' + port);
  }
});
