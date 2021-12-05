// IN-MEMORY STORAGE.
var rooms = [];

// This is a server-side, in-memory storage for room IDs and assocated users.

/**
 * Adds a user to a given room, identified by roomID.
 */
function addUser(roomID, userID, username) {
  // Iterate over rooms, add user to appropriate room if it exists.
  // Otherwise, create room storage and add user.
  let added = false;
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i][0] === roomID) {
      rooms[i][1].push({
        'userID': userID,
        'username': username
      });
      added = true;
    }
  }
  if (!added) {
    // If room doesn't exist, create it and add user.
    createRoom(roomID);
    // Recursive call to add user to newly created room.
    addUser(roomID, userID, username);
  }
}

/**
 * Adds a room to the rooms array.
 */
function createRoom(roomID) {
  rooms.push(
    [roomID, []]
  )
}

/**
 * Returns an array with all the data related to a given room.
 */
function getRoom(roomID) {
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i][0] == roomID) {
      return rooms[i];
    }
  }
  return null;
}

/**
 * Returns the index position of a given room on the rooms array.
 */
function getRoomIndexPos(roomID) {
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i][0] === roomID) {
      return i;
    }
  }
  return null;
}

/**
 * Returns a user object (stores 'userID' and 'username').
 */
function getUser(roomID, userID) {
  let room = getRoom(roomID);
  if (room) {
    for (let i = 0; i < room[1].length; i++) {
      if (room[1][i].userID === userID) {
        return room[1][i];
      }
    }
  }
  return null;
}

/**
 * Modifies a room's user array to remove the indicated user.
 */
function deleteUser(roomID, userID) {
  let room = getRoom(roomID);
  let roomIndexPos = getRoomIndexPos(roomID);
  let users = [];
  if (room) {
    for (let i = 0; i < room[1].length; i++) {
      if (room[1][i].userID !== userID) {
        users.push(room[1][i]);
      }
    }
  }
  rooms[roomIndexPos] = [roomID, users];
}

/**
 * Removes a room from the list of rooms.
 */
function deleteRoom(roomID) {
  let roomArr = [];
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i][0] !== roomID) {
      roomArr.push(rooms[i]);
    }
  }
  rooms.push(roomArr);
}

/**
 * Returns the array of rooms from the global in-memory storage variable.
 */
function GetRooms() {
  return rooms;
}

/**
 * Returns an array with all users associated with a given room.
 */
function GetUsers(roomID) {
  let room = getRoom(roomID);
  if (room !== null) {
    return room[1];
  }
  return null;
}

export { addUser, getUser, deleteUser, deleteRoom, getRoom, GetRooms, GetUsers };

// STRUCTURE OF DATA.
// 'rooms' is an array of arrays.
// 'users' is an array of objects.
// var rooms = [
//   [roomID, users],
//   [roomID, users]
// ];

// Empty Example.
// rooms[ [1234, [{}, {}]], [5678, [{}, {}]], ]

// Empty Example, beautified.
//
  //    rooms [
  //      [1234, [
  //              { userID: null, username: null },
  //              { userID: null, username: null }
  //             ]
  //      ],
  //      [5678, [
  //              { userID: null, username: null },
  //              { userID: null, username: null }
  //             ]
  //      ]
  //    ]

// var users = [
//   { 'userID': 123, 'username': test1 },
//   { 'userID': 124, 'username': test2 }
// ];
