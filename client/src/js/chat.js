/////////////////////
//   CONFIG VARS   //
/////////////////////

import { io } from "socket.io-client";
const Swal = require('sweetalert2');
const url = 'http://localhost:'
const port = 3001;
const localhost = url + port;
const messageDiv = document.getElementById('messagediv');
const form = document.getElementById('form');
const input = document.getElementById('input');

// Fetch URL parameter for this session.
const rid = new URLSearchParams(window.location.search).get('rid');

///////////////
//   CHAT    //
///////////////

var username = {};
// Only prompt for a username on the lobby page.
if (window.location.pathname.includes("lobby") || window.location.pathname.includes("mpGame")) {
  // User must enter something, not leave it blank.
  username = await Swal.fire({
    titleText: "Who are you?",
    input: 'text',
    inputPlaceholder: 'Your username',
    inputValidator: (value) => {
      if (!value) {
        return 'You need to enter a username.';
      }
    }
  });
}

// Establish connection credentials to socket.io.
const socket = io(localhost, {
  autoConnect: false,
  auth: {
    roomID: rid,
    username: username ? username.value : '',
    userID: null,
    users: null
  }
});

if (username) {
  socket.connect();
}

// On connection, emit user details to server.
socket.on('connect', () => {
  socket.emit('joined-user');
});

// Server responds to 'joined-user' (above) with a message to the session's room.
socket.on('joined', (data) => {
  let count = 0;
  for (let i = 0; i < data.users.length; i++) {
    count++;
  }
  let inRoom = (count === 1) ? "You are alone here." : `${count} people in chat.`;
  sendMessage(`${data.username} has entered the room. ` + inRoom);
});

socket.on('getLocation', () => {
  if (window.location.pathname.includes("lobby")) {
    socket.emit('location', 'lobby');
  } else {
    socket.emit('location', 'game');
  }
});

socket.on("console", (data) => {
  console.log(data.msg);
});

socket.on('msg', (data) => {
  // Call function to display username and message.
  sendMessage(`${data.username}: ${data.message}`);
});

socket.on('disconnected', (data) => {
  let count = 0;
  for (let i = 0; i < data.users.length; i++) {
    count++;
  }
  let inRoom = (count === 1) ? "You are alone here." : `${count} people in chat.`;
  sendMessage(`${data.username}` + ' has left the room. ' + inRoom);
});

form.addEventListener('submit', e => {
  // Clicking send will not reload page.
  e.preventDefault();
  let message = input.value;
  socket.emit('share-msg', (message));
  // Clears out input box after sending msg.
  input.value = '';
});

// Pass in message and append in messageDiv.
function sendMessage(message) {
  const msg = document.createElement('div');
  msg.innerText = message;
  messageDiv.append(msg);
}
