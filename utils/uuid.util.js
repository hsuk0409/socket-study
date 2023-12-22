const uuidGen = require("uuid");

function generateUUID() {
  return uuidGen.v4();
}

module.exports = {
  generateUUID,
};
