# Multiplayer Solitaire (Klondike)

## Initial Requirements for running this application:

In order to run this application locally, you will need to download a few things:

1. Node (version 14.18.1)
It is recommended to use NVM (Node Version Manager) to download Node and NPM locally: https://github.com/nvm-sh/nvm.

The version of Node used to create this repo's initial commit was `v.14.18.1`. Webpack 5 is incompatible with newer versions of Node.js, so make sure you are using a version between v.12 and v.14.

2. Several NPM Packages to Install Globally on Your Machine:
`npm install -g sass eslint`

## Downloading the Game Files
Once the above have been installed, you can initialize this project by pulling down the code from this repo and running the following command from the project's root: `npm install`

## Working from a Local Development Server
To work on this project locally, a development server can be created by running the following command from the project's root: `npm run start`

A browser running the application at http://localhost:3001 will open. You can press `Ctrl+C` from the command line to stop this server.

## Bundling the Application for Production Deployment
In order to package the files up for a deployment to a live server, the following command should be run: `npm run build`

Running this command will also open a browser running the application at http://localhost:3000. You can press `Ctrl+C` from the command line to close this server. After the `build` script has been run, the folder containing this game will have all of its files ready to be deployed to a production environment.

## Code Walkthrough

Listed below are highlighted sections of this application's codebase. These highlights are important for understanding the application's architecture, functionality, and build processes.

1. package.json

The package.json file, found in the project root, contains two important pieces of data. The first is the list of NPM packages installed to make this application function the way it does. The second is the list of scripts that can be triggered from the command line using NPM. Under the scripts section of package.json, there are 5 scripts listed that can be run:

  1. "lint" can be called by entering `npm run lint` from the command line. This script runs the ESLint scanner over the JavaScript files in the application, looking for bugs, errors, or inconsistencies. The rules used to define what ESLint checks for are defined in the `.eslintrc.js` file, also located in the root. This currently throws multiple errors because the team did not have sufficient time to properly lint and debug the JavaScript in this application.
  2. "clean-dist" can be called by entering `npm run clean-dist`. This script deletes the entire "client/dist" directory and then recreates it with no contents. When creating a production build, this command can be run to start the dist folder from a blank slate since it gets created by the build script.
  3. "start" can be called by entering `npm run start`. This starts a development server using Node and Webpack and then opens that server in your computer's default browser.
  4. "build" can be called by entering `npm run build`. This script simply checks that a your Webpack configurations will not throw any errors if used in a build.
  5. "post-build" can be called by entering `npm run post-build`; however, this is not advisable. The "post-build" script gets called automatically after the "build" script is successfully run. This script triggers the Webpack bundling process and then builds a static, production version of the application that can be deployed to a live server and puts everything in the "client/dist" directory. It does not need to be called explicitly.

2. Webpack and Babel

Webpack is used to handle Dart Sass compilation, image compression, and code bundling via entry points. Each entry point represents a bundle that can be included or excluded from a section of the application's HTML files. Webpack utilizes Babel (configuration found in `.babelrc` in the project root) for JavaScript transpilation, that is, interpretation of JavaScript from varying versions of the language to a common core that browsers can easily interpret. For Webpack, there are 2 configuration files in the root of the codebase:

  1. `webpack.config.dev.js` defines the conditions for building and serving a local dev server.
  2. `webpack.config.js` defines the production version of the local dev server.

These 2 files are identical except for a single line which defines whether it is a development environment or a production environment. Currently, the production version of the application is incomplete as the local development version is all the team had time to finish building. If running `npm run build` to view the production version, the user will see some functionality (like the real-time chat) not working since it is not defined in the `distServer.js` file.

3. /server

The "server" directory contains 3 files: `build.js`, `devServer.js`, `distServer.js`. The build.js file only allows Node to check if an error is detected in Webpack's configuration. The devServer.js is the primary file containing how our local server is configured. This contains the Express and Socket.io configurations for routing pages and handling bi-directional communication between multiple clients, respectively. The distServer.js file is the production version of devServer.js, but it lacks any functionality beyond basic Express routing.

4. /client/src

This directory contains all of the working files used to build this application.

  1. /client/src/scss   Contains all Sass files that are compiled into `styles.css` in the dist folder.
  2. /client/src/js     Contains in-memory storage functions, chat functionality, and game logic.
  3. /client/src        Contains the JS files used as entry points by Webpack and served by Express via the HTML files found in the root of this subdirectory.

5. /client/dist

This directory contains the final version of files that are created during the scripted build process. This is where the application is served from when a server is started and contains files that are in their minified/compressed form.

6. /node_modules

This is the directory where Node/NPM stores all vendor libraries that are downloaded in relation to the dependencies listed in package.json.
