// Utility function to get the next available ID
//compared to just using array.length to account for deletions
const getNextId = (items) => {
  return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
};
module.exports = getNextId;
