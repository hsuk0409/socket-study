module.exports = function (io, socket) {
  socket.on("socket:init", async function (data, callBack) {
    console.log(`>>>> [socket:init] data: ${JSON.stringify(data)} <<<<`);

    return await callBack({ code: "SUCCESS", data: 1 });
  });

  socket.on("disconnect", async function (data, callBack) {
    console.log(`>>>> [disconnect] data: ${JSON.stringify(data)} <<<<`);
  });
};
