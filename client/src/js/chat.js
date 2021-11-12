/////////////////////
//   CONFIG VARS   //
/////////////////////
import { io } from "socket.io-client";
const url = 'http://localhost:'
const port = 3001;
const socketio = io(url + port);
const messageDiv = document.getElementById('messagediv');
const form = document.getElementById('form');
const input = document.getElementById('input');
const data = { userId: socketio.id };
// ask for name for chat
const username = prompt('Please Enter Name: ');

///////////////
//   CHAT    //
///////////////

// add message after entering chat
sendMessage('Welcome to the chat, ' + `${username}` + '!');

socketio.emit('joined-user', username);

socketio.on('joined', username => {
  sendMessage(`${username} has entered the chat.`);
});

socketio.on('msg', data => {
  // console.log(data);
  // call function to display username and message
  sendMessage(`${data.username}: ${data.message}`);
});

socketio.on('disconnected', username => {
  sendMessage(`${username}` + ' has left the chat.')
});

form.addEventListener('submit', e => {
  // clicking send will not reload page
  e.preventDefault();
  const message = input.value;
  sendMessage(`${username}: ${message}`)
  socketio.emit('share-msg', message)
  // clears out input box after sending msg
  input.value = '';
});

// pass in message and append in messageDiv
function sendMessage(message) {
  const msg = document.createElement('div');
  msg.innerText = message;
  messageDiv.append(msg);
}
