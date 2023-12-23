const { generateUUID } = require("../utils/uuid.util");
const { RoomClosure } = require("../closures/room.closure");

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
   *
   * * 체크 사항
   * * - 서버 사양에 따른 게임/방 제한
   */

  /**
   * * 방 생성
   * * req
   * *  roomUserLimit: int
   * *  gameType: string
   * * res
   * *  실패 시
   * *    {code: "FAIL", message: ""}
   * *  성공 시
   * *    {code: "SUCCESS", data: {}}
   * * 생성 후 필요한 행동
   * * ...
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

    const roomLimit = 5;
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
};
