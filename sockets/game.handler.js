const { generateUUID } = require("../utils/uuid.util");
const { RoomClosure } = require("../closures/room.closure");
const validation = require("../utils/validation.util");

module.exports = function (io, socket) {
  /**
   * * 게임 기능
   * * 1. 방 생성
   * *    - 최대 인원수 제한
   * *    - room_uid 생성
   * *    - game_type 파라미터
   * * 2. 방 입장
   * * 3. 게임 시작
   * * 4. 게임에 대한 플레이 데이터 공유
   * * 5. 방 떠나기
   *
   * * 체크 사항
   * * - 서버 사양에 따른 게임/방 제한
   */

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
   * *    {code: "SUCCESS", data: {}}
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
      return await callBack({ code: "FAIL", message: errorMsg });
    }

    const roomLimit = 10;
    if (roomFunc.getRoomLength() > roomLimit) {
      const errorMsg = `Room is full.`;
      console.error(errorMsg);
      return await callBack({ code: "FAIL", message: errorMsg });
    }

    const roomUserLimit = data.roomUserLimit || 5;
    const gameType = data.gameType || "CATCH_TAIL";
    const room = roomFunc.createRoom(roomId, roomUserLimit, gameType);

    return await callBack({
      code: "SUCCESS",
      data: { roomId: roomId, roomInfo: room },
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
   * *    {code: "SUCCESS", data: {}}
   * * 소켓 처리
   * *  socket.join(roomId)
   * *  io.sockets.in(roomId).emit("userList", {uid, room})
   */
  socket.on("room:join", async function (data, callBack) {
    const roomId = data.roomId;
    if (validation.isEmpty(roomId)) {
      const errorMsg = `roomId is required.`;
      console.error(errorMsg);
      return await callBack({ code: "FAIL", message: errorMsg });
    }

    const uid = socket.uid;
    if (validation.isEmpty(uid)) {
      const errorMsg = `socket.uid is null... [${uid}]`;
      console.error(errorMsg);
      return await callBack({ code: "FAIL", message: errorMsg });
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
      return await callBack({ code: "FAIL", message: errorMsg });
    }

    await socket.join(roomId);
    await io.sockets.in(roomId).emit("userList", { uid: uid, room: room });

    return await callBack({ code: "SUCESS", data: room });
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
   * *    {code: "SUCCESS", data: {}}
   * * 소켓 처리
   * *  socket.leave(roomId)
   * *  io.sockets.in(roomId).emit("userList", {uid, room})
   */
  socket.on("room:leave", async function (data, callBack) {
    const roomId = data.roomId;
    if (validation.isEmpty(roomId)) {
      const errorMsg = `roomId is required.`;
      console.error(errorMsg);
      return await callBack({ code: "FAIL", message: errorMsg });
    }

    const uid = socket.uid;
    if (validation.isEmpty(uid)) {
      const errorMsg = `socket.uid is null... [${uid}]`;
      console.error(errorMsg);
      return await callBack({ code: "FAIL", message: errorMsg });
    }

    const roomFunc = new RoomClosure();
    //? 모든 방에서 떠나게 하는 기능이 필요할까?
    const room = roomFunc.leaveRoom(roomId, uid);

    await socket.leave(roomId);
    await io.sockets.in(roomId).emit("userList", { uid: uid, room: room });

    return await callBack({ code: "SUCESS", data: room });
  });
};
