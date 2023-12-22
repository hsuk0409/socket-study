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
   */
  socket.on("room:create", async function (data, callBack) {
    const roomFunc = new RoomClosure();
    let roomData = roomFunc.getRoomData();
    let roomId;
    try {
      roomId = generateUUID();
      while (roomId in roomData === true) {
        roomId = generateUUID();
      }
    } catch (err) {
      const errorMsg = `Create room error! ${JSON.stringify(err)}`;
      console.error(errorMsg);
      return await callBack({ code: "FAIL", message: errorMsg });
    }

    const roomLimit = 5;
    if (roomData.length > roomLimit) {
      const errorMsg = `Room is full.`;
      console.error(errorMsg);
      return await callBack({ code: "FAIL", message: errorMsg });
    }

    roomData = roomFunc.createRoom(roomId);

    return await callBack({ code: "SUCCESS", data: roomData[roomId] });
  });
};
