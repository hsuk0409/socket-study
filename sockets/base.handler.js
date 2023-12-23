const { RoomClosure } = require("../closures/room.closure");

module.exports = function (io, socket) {
  socket.on("disconnect", async function (data) {
    console.log(`>>>> [disconnect] data: ${JSON.stringify(data) || ""} <<<<`);
    const roomFunc = new RoomClosure();
    roomFunc.clearClosure();
    //TODO 소켓 정리
  });
};
