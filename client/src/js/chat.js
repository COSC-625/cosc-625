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
console.log("Session ID: " + urlParams);


///////////////
//   CHAT    //
///////////////

const username = "";
// User must enter something, not leave it blank.
while (username === "") {
  username = prompt('Please Enter a Name: ');
}

// With valid username, connect to Socket.io, add auth token and username to handshake object.
const socketio = io(url + port, {
  // auth.token is a preset object for passing credentials.
  auth: {
    // In order to ensure sessions remain constant, get them from the URL.
    token: sid
  },
  // The query object is used to pass any user-defined key-value pairs.
  query: {
    username: username,
    userID: null
  }
});

socketio.onAny((event, ...args) => {
  console.log(event, args);
});

// When a user joins, send username to server.
socketio.emit('joined-user', username);

// Server responds to 'joined-user' with an emitted message.
socketio.on('joined', username => {
  sendMessage(`${username} has entered the chat.`);
});

// When the server initializes a session.
socketio.on("the-session", ({ sessionID, userID }) => {
  //get sessionID and username when page opens. then attach each to auth object
  if (sessionID !== null && username !=+ '') {
    // socketio.auth = { sessionID };
    // socketio.auth = { username };
    // socketio.connect();
    //add message after entering chat
    sendMessage('Welcome to the chat, ' + `${username}` + '!');
  }
  socketio.auth = { sessionID }; //session ID will be attached whenever reconnecting
  //localstorage allows for preserving session across tabs and when refreshed/reconnected, so all tabs will have same sessionID
  //store sessionID into localStorage
  localStorage.setItem("sessionID", sessionID);
  socketio.query.userID = userID;
});

socketio.on('msg', data => {
  //console.log(data);
  //call function to display username and message
  sendMessage(`${data.username}: ${data.message}`);
});

socketio.on('disconnected', userID => {
  for (let i = 0; i < this.users.length; i++) {
    const user = this.users[i];
    if (user.userID === id) {
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
  socketio.emit('share-msg', message)
  // clears out input box after sending msg
  input.value = '';
});

//pass in message and append in messageDiv
function sendMessage(message) {
  const msg = document.createElement('div');
  msg.innerText = message;
  messageDiv.append(msg);
}
