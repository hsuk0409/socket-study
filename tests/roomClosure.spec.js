const { RoomClosure } = require("../closures/room.closure");

test("성공적으로 uuid로 방 하나가 생성된다.", () => {
  const roomObj = new RoomClosure();
  roomObj.createRoom("a");
  const roomData = roomObj.getRoomData();
  expect(roomData != null);
  expect(roomObj.getRoomLength == 1);
});
