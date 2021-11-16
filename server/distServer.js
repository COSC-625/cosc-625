/////////////////////
//      SERVER     //
/////////////////////
import { join } from 'path';
import compression from 'compression';

const express = require('express');
const app = express();
const open = require('open');
const port = 3000 || process.env.PORT;

app.use(compression());
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
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    open('http://localhost:' + port);
  }
});
