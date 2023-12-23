module.exports = {
  isEmpty(value) {
    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === "string" || Array.isArray(value)) {
      return value.length === 0;
    }

    if (typeof value === "object" && value.constructor === Object) {
      return Object.keys(value).length === 0;
    }

    return value === 0 || value === false;
  },
};
