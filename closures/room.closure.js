function RoomClosure() {
  var roomData = {};

  this.getRoom = function (roomId) {
    return roomData[roomId];
  };

  this.getRoomLength = function () {
    return Object.keys(roomData).length;
  };

  this.duplicateRoomId = function (roomId) {
    return roomId in roomData;
  };

  this.createRoom = function (roomId, roomUserLimit, gameType) {
    roomData[roomId] = {
      roomUserLimit: roomUserLimit,
      gameType: gameType,
      roomUsers: [],
    };
    return roomData[roomId];
  };

  this.canEnterRoom = function (roomId) {
    const room = roomData[roomId];
    return room.roomUserLimit > room.roomUsers.length;
  };

  this.joinRoom = function (roomId, uid) {
    if (roomId in roomData === false) {
      console.log(`Not exists room id`);
      return null;
    }
    const room = roomData[roomId];
    if (uid in room.roomUsers) {
      return room;
    }
    if (this.canEnterRoom(roomId) === false) {
      console.log(`Room user is full.`);
      return null;
    }
    room.roomUsers.push(uid);
    return room;
  };

  this.leaveRoom = function (roomId, uid) {
    const room = roomData[roomId];
    if (uid in room) {
      delete room[uid];
    }

    return room;
  };

  this.removeRoom = function (roomId) {
    if (roomId in roomData) {
      delete roomData[roomId];
    }

    return roomData[roomId];
  };

  this.clearClosure = function () {
    roomData = {};
  };
}

module.exports = {
  RoomClosure,
};
