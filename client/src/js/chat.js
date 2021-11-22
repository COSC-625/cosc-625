/////////////////////
//   CONFIG VARS   //
/////////////////////
import { io } from "socket.io-client";
const url = 'http://localhost:'
const port = 3001;
const messageDiv = document.getElementById('messagediv');
const form = document.getElementById('form');
const input = document.getElementById('input');

// Fetch URL parameter for this session.
const sid = new URLSearchParams(window.location.search).get('sid');
console.log("Session ID: " + sid);


///////////////
//   CHAT    //
///////////////

var username = '';
// Only prompt for a username on the lobby page.
if (window.location.pathname.includes("lobby")) {
  // User must enter something, not leave it blank.
  while (username === '') {
    username = prompt('Please Enter a Name: ');
  }
}

// With valid username, connect to Socket.io, add auth package to handshake object.
const socket = io(url + port, {
  autoConnect: false,
  auth: {
    sessionID: sid,
    username: username,
    userID: Math.round(Math.random() * 100000),
    userList: []
  }
});
socket.connect();
socket.emit('joined-user', username);

// Register a catch-all event listener.
socket.onAny((event, ...args) => {
  console.log(`Event detected: ${event}`);
});

// Server responds to 'joined-user' (above) with a message to the session's room.
socket.on('joined', username => {
  sendMessage(`${username} has entered the chat.`);
});

// When the server initializes a session.
socket.on("the-session", ({ sessionID, userID, username, userList }) => {
  // Check if user already entered this chat previously.
  const sessID = localStorage.getItem("sessionID");
  if (sessID === sessionID) {
    // If so, welcome them back.
    sendMessage('Welcome back, ' + `${username}` + '!');
  }
  // If not, attach values to auth object and welcome them.
  // NOT SURE IF NECESSARY EXCEPT ON SESSION 'RECONNECT'.
  // ON INITIAL CONNECTION, 'socket.auth' IS ALREADY SET.
  else if (sessionID && userID && username !== "") {
    socket.auth = {
      sessionID: sessionID,
      username: username,
      userID: userID,
      userList: (userList && userList.length !== 0) ? userList : []
    };
    localStorage.setItem("sessionID", sessionID);
    //add message after entering chat
    sendMessage('Welcome to the chat, ' + `${username}` + '!');
  }
});

const users = [];
socket.on('users', userList => {
  users = userList;
});

socket.on('msg', data => {
  //console.log(data);
  //call function to display username and message
  sendMessage(`${data.username}: ${data.message}`);
});

socket.on('disconnected', uid => {
  for (let i = 0; i < users.length; i++) {
    const user = this.users[i];
    if (user.userID === uid) {
      user.connected = false;
      break;
    }
  }
  sendMessage(`${username}` + ' has left the chat.')
});

form.addEventListener('submit', e => {
  //clicking send will not reload page
  e.preventDefault();
  const message = input.value;
  sendMessage(`${username}: ${message}`)
  socket.emit('share-msg', (message, username))
  // clears out input box after sending msg
  input.value = '';
});

//pass in message and append in messageDiv
function sendMessage(message) {
  const msg = document.createElement('div');
  msg.innerText = message;
  messageDiv.append(msg);
}
