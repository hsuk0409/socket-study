const moment = require("moment-timezone");

module.exports = {
  getCurrentDate() {
    return moment.utc(new Date()).tz("Asia/Seoul").format("YYYY-MM-DD");
  },

  getCurrentDatetime() {
    return moment
      .utc(new Date())
      .tz("Asia/Seoul")
      .format("YYYY-MM-DD HH:mm:ss");
  },
};
