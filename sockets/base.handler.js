module.exports = function (io, socket) {
  socket.on("socket:init", function (data, callBack) {
    console.log(`>>>> [socket:init] data: ${JSON.stringify(data)} <<<<`);

    return callBack({ code: "SUCCESS", data: 1 });
  });
};
