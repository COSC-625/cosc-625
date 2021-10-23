# Multiplayer Solitaire (Klondike)

## Initial Requirements for running this application:

In order to run this application locally, you will need to download a few things:

1. Node (version > 12)
It is recommended to use NVM (Node Version Manager) to download Node and NPM locally: https://github.com/nvm-sh/nvm.

The version of Node used to create this repo's initial commit was `v.14.18.1`.

2. Several NPM Packages to Install Globally on Your Machine:
`npm install -g sass n eslint`

## Downloading the Game Files
Once the above have been installed, you can initialize this project by pulling down the code from this repo and running the following command from the project's root: `npm install`

## Working from a Local Development Server
To work on this project locally, a development server can be created by running the following command from the project's root: `npm run start`

A browser running the application at http://localhost:3001 will open. You can press `Ctrl+C` from the command line to stop this server.

## Bundling the Application for Production Deployment
In order to package the files up for a deployment to a live server, the following command should be run: `npm run build`

Running this command will also open a browser running the application at http://localhost:3000. You can press `Ctrl+C` from the command line to close this server. After the `build` script has been run, the folder containing this game will have all of its files ready to be deployed to a production environment.
