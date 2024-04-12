function concatUnique(...values) {
  return [...new Set([].concat(...values))];
}
module.exports = {
  concatUnique,
};
