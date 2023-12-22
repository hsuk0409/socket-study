const { RoomClosure } = require("../closures/room.closure");

module.exports = function (io, socket) {
  socket.on("disconnect", async function (data) {
    console.log(`>>>> [disconnect] data: ${JSON.stringify(data) || ""} <<<<`);
    //TODO 클로저 상태 정리
  });
};
