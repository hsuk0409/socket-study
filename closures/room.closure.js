function RoomClosure() {
  var roomData = {};

  this.getRoomData = function () {
    return roomData;
  };

  this.getRoomLength = function () {
    return Object.keys(roomData).length;
  };

  this.createRoom = function (roomId) {
    roomData[roomId] = {};
    return roomData;
  };

  this.joinRoom = function (roomId, uid) {
    if (roomId in roomData === false) {
      console.error(`Not exists room id`);
      return null;
    }
    if (uid in roomData[roomId]) {
      return roomData[roomId];
    }
    const roomUserLimit = 5;
    if (roomData[roomId].length > roomUserLimit) {
      console.log(`Room user is full.`);
      return null;
    }
    roomData[roomId].push(uid);
    return roomData[roomId];
  };

  this.reaveRoom = function (roomId, uid) {
    if (uid in roomData[roomId]) {
      delete roomData[roomId][uid];
    }
  };

  this.removeRoom = function (roomId) {
    if (roomId in roomData) {
      delete roomData[roomId];
    }
  };
}

module.exports = {
  RoomClosure,
};
