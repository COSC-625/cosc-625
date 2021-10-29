import { io } from "socket.io-client";
const socketio = io('http://localhost:3001');
const messageDiv = document.getElementById('messagediv');
const form = document.getElementById('form');
const input = document.getElementById('input');

socketio.on('msg', data => {
  //console.log(data);
  sendMessage(data); // call function to display message
});

form.addEventListener('submit', e => {
  e.preventDefault(); // clicking send will not reload page
  const message = input.value;
  socketio.emit('share-msg', message)
  input.value = ''; // clears out input box after sending msg
});


// pass in message and append in messageDiv
function sendMessage(message) {
  const msg = document.createElement('div');
  msg.innerText = message;
  messageDiv.append(msg);
};
