import "./scss/style.scss";
import { io } from "socket.io-client";
const socketio = io('http://localhost:3001');
const messageDiv = document.getElementById('messagediv');
const form = document.getElementById('form');
const input = document.getElementById('input');

//ask for name for chat
const username = prompt('Please Enter Name: ');

//add message after entering chat
sendMessage('Welcome, ' + `${username}` + '! You are now in the chat.');

socketio.emit('joined-user', username);

socketio.on('msg', data => {
  //console.log(data);
  //call function to display username and message
  sendMessage(`${data.username}: ${data.message}`);
});

socketio.on('joined', username => {
  sendMessage(`${username} connected`);
});

form.addEventListener('submit', e => {
  e.preventDefault(); //clicking send will not reload page
  const message = input.value;
  sendMessage(`${username}: ${message}`)
  socketio.emit('share-msg', message)
  input.value = ''; //clears out input box after sending msg
});


//pass in message and append in messageDiv
function sendMessage(message) {
  const msg = document.createElement('div');
  msg.innerText = message;
  messageDiv.append(msg);
}
