import webpack from 'webpack';
import config from '../webpack.config.dev.js';
import { join } from 'path';

const server = require('express')();
const open = require('open');
const port = 3001;
const compiler = webpack(config);

server.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

server.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../client/src/index.html'));
});

server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    open('http://localhost:' + port);
  }
});
