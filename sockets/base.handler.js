const { RoomClosure } = require("../closures/room.closure");
const validation = require("../utils/validation.util");

module.exports = function (io, socket) {
  socket.on("disconnect", async function (data) {
    console.log(`>>>> [disconnect] data: ${JSON.stringify(data) || ""} <<<<`);
    const roomFunc = new RoomClosure();
    const roomId = socket.roomId;
    if (validation.isEmpty(roomId)) return;
    console.log(`roomId in disconnect: ${roomId}`);
    const room = roomFunc.getRoom(roomId);
    if (validation.isEmpty(room)) return;

    console.log(`roomUsers in disconnect: ${JSON.stringify(room.roomUsers)}`);
    if (room.roomUsers.length < 2) {
      roomFunc.removeRoom(roomId);
    } else {
      roomFunc.leaveRoom(roomId, socket.uid);
    }
  });
};
