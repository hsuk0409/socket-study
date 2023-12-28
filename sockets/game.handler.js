const { generateUUID } = require("../utils/uuid.util");
const { RoomClosure } = require("../closures/room.closure");
const validation = require("../utils/validation.util");

module.exports = function (io, socket) {
  /**
   * * 게임 기능
   * * 0. 소켓 초기화
   * * 1. 방 생성
   * *    - 최대 인원수 제한
   * *    - room_uid 생성
   * *    - game_type 파라미터
   * * 2. 방 입장
   * * 3. 게임 시작
   * * 4. 인게임 데이터 공유
   * * 5. 방 떠나기
   *
   * * 체크 사항
   * * - 서버 사양에 따른 게임/방 제한
   */

  /**
   * * 소켓 초기화
   * * 클라로 유저 데이터 전송
   * * req
   * * res
   * * 소켓 처리
   */
  socket.on("socket:init", async function (data, callBack) {
    const uid = socket.uid;
    console.log(`uid in init: ${uid}`);
    await socket.emit("socket:uid", { uid });
    // return await callBack({ code: "SUCCESS", data: { uid } });
  });

  /**
   * * 방 생성
   * * -> 최초 생성된 방 PC는 유저는 없고 화면을 공유하기 위한 용도
   * * req
   * *  roomUserLimit: int
   * *  gameType: string
   * * res callBack
   * *  실패 시
   * *    {code: "FAIL", message: ""}
   * *  성공 시
   * *    {code: "SUCCESS", data: { roomId, room }}
   * * 소켓 처리
   */
  socket.on("room:create", async function (data, callBack) {
    const roomFunc = new RoomClosure();
    let roomId;
    try {
      roomId = generateUUID();
      while (roomFunc.duplicateRoomId(roomId)) {
        roomId = generateUUID();
      }
    } catch (err) {
      const errorMsg = `Create room error! ${JSON.stringify(err)}`;
      console.error(errorMsg);
      await socket.emit("errorProcess", { code: "FAIL", message: errorMsg });
      return;
    }

    const roomLimit = 10;
    if (roomFunc.getRoomLength() > roomLimit) {
      const errorMsg = `Room is full.`;
      console.error(errorMsg);
      await socket.emit("errorProcess", { code: "FAIL", message: errorMsg });
      return;
    }

    const roomUserLimit = data.roomUserLimit || 5;
    const gameType = data.gameType || "CATCH_TAIL";
    const room = roomFunc.createRoom(roomId, roomUserLimit, gameType);

    await socket.join(roomId);
    await socket.emit("room:create", {
      code: "SUCCESS",
      data: { roomId, room },
    });
  });

  /**
   * * 방 입장
   * * req
   * *  roomId: string
   * * res callBack
   * *  실패 시
   * *    {code: "FAIL", message: ""}
   * *  성공 시
   * *    {code: "SUCCESS", data: { roomId, room }}
   * * 소켓 처리
   * *  socket.join(roomId)
   * *  io.sockets.in(roomId).emit("userList", {uid, room})
   */
  socket.on("room:join", async function (data, callBack) {
    const roomId = data.roomId;
    if (validation.isEmpty(roomId)) {
      const errorMsg = `roomId is required.`;
      console.error(errorMsg);
      await socket.emit("errorProcess", { code: "FAIL", message: errorMsg });
      return;
    }

    const uid = socket.uid;
    if (validation.isEmpty(uid)) {
      const errorMsg = `socket.uid is null... [${uid}]`;
      console.error(errorMsg);
      await socket.emit("errorProcess", { code: "FAIL", message: errorMsg });
      return;
    }

    const roomFunc = new RoomClosure();
    if (validation.isEmpty(socket.roomId) === false) {
      roomFunc.leaveRoom(roomId, uid);
      await socket.leave(roomId);
    }
    socket.roomId = roomId;

    const room = roomFunc.joinRoom(roomId, uid);
    if (validation.isEmpty(room)) {
      const errorMsg = `Fail join room...`;
      console.error(errorMsg);
      await socket.emit("errorProcess", { code: "FAIL", message: errorMsg });
      return;
    }

    await socket.join(roomId);
    await io.to(roomId).emit("userList", { uid, room });
  });

  /**
   * * 인게임 대기 상태 확인
   * * 게임 시작 전 방장을 제외한 방 유저들의 컨트롤러를 막는다.
   *
   */
  socket.on("game:status", async function (data, callBack) {});

  /**
   * ? 게임 시작 이벤트에 대한 소켓 작업이 필요한게 있을까?
   * * 인게임 시작 이벤트
   * * 카운트다운 끝나고 게임 시작 시 방장을 제외한 유저들에게 게임 시작을 알린다.
   */
  socket.on("game:start", async function (data, callBack) {});

  /**
   * * 인게임 데이터 공유
   * * req
   * *  roomId: string
   * *  uid: string
   * *  gameType: string
   * *  gameData: object
   * * res callBack
   * * 소켓 처리
   * *  io.sockets.in(roomId).emit("gameData", {data: gameData})
   */
  socket.on("game:progress", async function (data, callBack) {
    const roomId = data.roomId || socket.roomId;
    const uid = socket.uid;
    if (!validation.isEmpty(roomId) && !validation.isEmpty(uid)) {
      const gameData = data.gameData;
      await io.sockets.in(roomId).emit("gameData", { data: gameData });
    } else {
      const errorMsg = `roomId or uid is required.`;
      console.error(errorMsg);
    }
  });

  /**
   * * 방 떠나기
   * * req
   * *  roomId: string
   * *  uid: string
   * * res callBack
   * *  실패 시
   * *    {code: "FAIL", message: ""}
   * *  성공 시
   * *    {code: "SUCCESS", data: { roomId, room }}
   * * 소켓 처리
   * *  socket.leave(roomId)
   * *  io.sockets.in(roomId).emit("userList", {uid, room})
   */
  socket.on("room:leave", async function (data, callBack) {
    const roomId = data.roomId || socket.roomId;
    if (validation.isEmpty(roomId)) {
      const errorMsg = `roomId is required.`;
      console.error(errorMsg);
      await socket.emit("errorProcess", { code: "FAIL", message: errorMsg });
      return;
    }

    const uid = socket.uid;
    if (validation.isEmpty(uid)) {
      const errorMsg = `socket.uid is null... [${uid}]`;
      console.error(errorMsg);
      await socket.emit("errorProcess", { code: "FAIL", message: errorMsg });
      return;
    }

    const roomFunc = new RoomClosure();
    const room = roomFunc.leaveRoom(roomId, uid);
    await socket.leave(roomId);
    await io.sockets.in(roomId).emit("userList", { uid, room });
  });
};
