const { RoomClosure } = require("../closures/room.closure");

test("임이의 방 아이디로 방 하나가 성공적으로 생성된다.", () => {
  const roomFunc = new RoomClosure();
  const roomId = "a";
  roomFunc.createRoom(roomId);
  const room = roomFunc.getRoom(roomId);
  expect(room != null);
  expect(roomFunc.getRoomLength == 1);
  expect(room.roomUserLimit == 5);
  expect(room.gameType == "CATCH_TAIL");
  expect(room.roomUsers.length == 0);
});

test("이미 생성된 방 아이디는 중복검사에 true를 반환한다.", () => {
  const roomFunc = new RoomClosure();
  const roomId = "a";
  roomFunc.createRoom(roomId);
  expect(roomFunc.duplicateRoomId(roomId) === true);
  expect(roomFunc.getRoomLength == 1);
});

test("방 삭제하면 방 조회 때 null을 반환한다.", () => {
  const roomFunc = new RoomClosure();
  const roomId = "a";
  roomFunc.createRoom(roomId);
  expect(roomFunc.duplicateRoomId(roomId) === true);
  roomFunc.removeRoom(roomId);
  expect(roomFunc.getRoomLength == 0);
  const roomIsNull = roomFunc.getRoom(roomId);
  expect(roomIsNull == null);
});
