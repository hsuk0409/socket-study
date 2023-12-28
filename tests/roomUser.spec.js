const roomFunc = require("../closures/room.closure");

test("유저 justin이 a 방에 성공적으로 입장한다.", () => {
  const roomId = "a";
  roomFunc.createRoom(roomId, 10, "CATCH_TAIL");

  const uid = "justin";
  const room = roomFunc.joinRoom(roomId, uid);
  expect(room.roomUsers.length == 1);
  expect(room.roomUsers[0] == uid);
});

test("동일한 유저가 같은 방에 다시 입장해도 방 상태를 기존대로 유지한다.", () => {
  const roomId = "a";
  roomFunc.createRoom(roomId, 10, "CATCH_TAIL");

  const uid = "justin";
  let room = roomFunc.joinRoom(roomId, uid);
  room = roomFunc.joinRoom(roomId, uid);
  room = roomFunc.joinRoom(roomId, uid);
  expect(room.roomUsers.length == 1);
  expect(room.roomUsers[0] == uid);
});

test("방이 존재하지 않을 경우 null을 반환한다.", () => {
  const roomId = "a";

  const uid = "justin";
  const room = roomFunc.joinRoom(roomId, uid);
  expect(room == null);
});

test("방에 제한 인원이 다 찼을 경우 null을 반환한다.", () => {
  const roomId = "a";
  roomFunc.createRoom(roomId, 1, "CATCH_TAIL");

  const uid = "justin";
  let room = roomFunc.joinRoom(roomId, uid);
  expect(room.roomUsers.length == 1);
  expect(room.roomUsers[0] == uid);
  room = roomFunc.joinRoom(roomId, uid);
  expect(room == null);
});
