const main = require("../../magic");
const _ = require("lodash");

const getAvatarData = (dataArr) => {
  const avatar = {};

  const avatar_s = main.findArrayById(dataArr, "543:16308");
  const avatar_m = main.findArrayById(dataArr, "159:4040");
  const avatar_l = main.findArrayById(dataArr, "543:16296");

  const DATA = {
    size: {
      s: {
        width: _.get(avatar_s, `absoluteBoundingBox.width`, 16),
        height: _.get(avatar_s, `absoluteBoundingBox.height`, 16),
      },      
      m: {
        width: _.get(avatar_m, `absoluteBoundingBox.width`, 28),
        height: _.get(avatar_m, `absoluteBoundingBox.height`, 28),
      },      
      l: {
        width: _.get(avatar_l, `absoluteBoundingBox.width`, 44),
        height: _.get(avatar_l, `absoluteBoundingBox.height`, 44),
      }
    }
  };

  Object.assign(avatar, DATA);

  return avatar;
};

exports.getAvatarData = getAvatarData;