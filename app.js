const express = require("express");
const app = express();

const HTTP = require("http");
const CORS = require("cors");
const socketIO = require("socket.io")({
  pingTimeout: 5 * 1000,
  pingInterval: 5 * 1000,
  upgradeTimeout: 5 * 2000,
  maxHttpBufferSize: 10e7,
  transports: ["websocket"],
});

app.use(CORS());

const datetimeUtil = require("./utils/datetime.util");
const config = require("./configs/configuration");
const listeningServer = HTTP.createServer(app);
listeningServer.listen(config.thisServer.port, (err) => {
  if (err) throw err;
  console.log(`> API Worker is running on: 16001`);
  console.log(`> Time: ${datetimeUtil.getCurrentDatetime()}`);
  console.log(`> Worker setting is ${process.env.NODE_ENV} Mode`);
  if (process.send) {
    process.send("ready");
    console.log("> sent ready for pm2");
  }
});

const io = socketIO.listen(listeningServer);
io.use((socket, next) => {
  let ipv4 = "0.0.0.0";
  try {
    ipv4 =
      socket.handshake.headers[`x-forwarded-for`].split(",")[0] ||
      socket.handshake.headers[`x-forwarded-for`] ||
      socket.conn.remoteAddress.split(":")[3].split(",")[0] ||
      "0.0.0.0";
  } catch (err) {
    console.log(`ipv4 err: ${JSON.stringify(err)}`);
  } finally {
    socket.ipv4 = ipv4;
  }

  console.log(`>>>>> Socket ipv4: ${ipv4} <<<<<`);
});

const socketBaseHandler = require("./sockets/base.handler");
io.on("connect", async (socket) => {
  socketBaseHandler(io, socket);
});

app.on("ready", () => {
  console.log(`Server running on port: ${config.thisServer.port}`);
});

app.on("error", (err) => {
  console.error(err);
});

app.use("*", (req, res, next) => {
  const err = "NOT FOUND";
  return res.status(400).json({ code: "FAIL", message: err });
});
