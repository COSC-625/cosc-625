import webpack from 'webpack';
import webpackConfig from '../webpack.config.js';
import chalk from 'chalk';

webpack(webpackConfig).run((err, stats) => {
  if (err) {
    console.log(chalk.red(err));
    return 1;
  }
  return 0;
});
