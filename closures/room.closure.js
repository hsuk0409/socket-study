const RoomClosure = () => {
  let roomData = {};

  const getRoom = (roomId) => {
    return roomData[roomId];
  };

  const getRoomLength = () => {
    return Object.keys(roomData).length;
  };

  const duplicateRoomId = (roomId) => {
    return roomId in roomData;
  };

  const createRoom = (roomId, roomUserLimit, gameType) => {
    roomData[roomId] = {
      roomUserLimit: roomUserLimit,
      gameType: gameType,
      roomUsers: [],
    };
    return roomData[roomId];
  };

  const canEnterRoom = (roomId) => {
    const room = roomData[roomId];
    return room.roomUserLimit > room.roomUsers.length;
  };

  const joinRoom = (roomId, uid) => {
    console.log(`roomData in closure joinRoom: ${JSON.stringify(roomData)}`);
    if (roomId in roomData === false) {
      console.log(`Not exists room id`);
      return null;
    }
    const room = roomData[roomId];
    if (uid in room.roomUsers) {
      return room;
    }
    if (canEnterRoom(roomId) === false) {
      console.log(`Room user is full.`);
      return null;
    }
    room.roomUsers.push(uid);
    return room;
  };

  const leaveRoom = (roomId, uid) => {
    const room = roomData[roomId];
    if (uid in room) {
      delete room[uid];
    }

    return room;
  };

  const removeRoom = (roomId) => {
    if (roomId in roomData) {
      delete roomData[roomId];
    }

    return roomData[roomId];
  };

  const clearClosure = () => {
    roomData = {};
  };

  return {
    getRoom,
    getRoomLength,
    duplicateRoomId,
    createRoom,
    canEnterRoom,
    joinRoom,
    leaveRoom,
    removeRoom,
    clearClosure,
  };
};

module.exports = RoomClosure();
