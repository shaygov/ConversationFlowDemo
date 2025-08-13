const main = require("../../magic");
const _ = require("lodash");

const getTimestamp = (dataArr) => {
  const timestampObj = {};

  const timeStamp = main.findArrayById(dataArr, "984:19229");
  const timeStampIcon = main.findArrayById(dataArr, "984:19230");
  const timeStampText = main.findArrayById(dataArr, "984:19226");
  
  const DATA = {
    gap: _.get(timeStamp, `timeStamp`, 4),
    icon: {
      opacity: _.get(timeStampIcon, `opacity`, 0.5)
    },
    text: {
      fontSize: _.get(timeStampText, `style.fontSize`, 11),
      fontWeight: _.get(timeStampText, `style.fontWeight`, 400),
      lineHeight: _.get(timeStampText, `style.lineHeightPx`, 16),
      color: `rgba(${main.rgbaObj(
        _.get(timeStampText, `fills[0].color.r`, 1)
      )}, ${main.rgbaObj(
        _.get(timeStampText, `fills[0].color.g`, 1)
      )}, ${main.rgbaObj(
        _.get(timeStampText, `fills[0].color.b`, 1)
      )}, ${main.roundToDecimal(_.get(timeStampText, `opacity`, 1), 2)})`
    }
  };

  Object.assign(timestampObj, DATA);

  return timestampObj;
};

exports.getTimestamp = getTimestamp;