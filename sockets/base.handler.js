module.exports = function (io, socket) {
  socket.on("socket:init", async function (data) {
    console.log(`>>>> [socket:init] data: ${JSON.stringify(data)} <<<<`);

    await io.emit("connect", { code: "SUCCESS", data: 1 });
  });

  socket.on("disconnect", async function (data) {
    console.log(`>>>> [disconnect] data: ${JSON.stringify(data) || ""} <<<<`);
  });
};
