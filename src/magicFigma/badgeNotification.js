const main = require("../../magic");
const _ = require("lodash");

const getNotificationData = (dataArr) => {
  const notificationData = {};

  const NOTIFICATION_OPENED = main.findArrayById(dataArr, "57:22591");
  const NOTIFICATION_CLOSED = main.findArrayById(dataArr, "57:22489");
  const NOTIFICATION_TEXT = main.findArrayById(dataArr, "57:22592");

  const DATA = {
    globals: {
      width: _.get(NOTIFICATION_OPENED, `absoluteBoundingBox.width`, 28),
      height: _.get(NOTIFICATION_OPENED, `absoluteBoundingBox.height`, 28),
      borderRadius: _.get(NOTIFICATION_OPENED, `cornerRadius`, 4),
      fontSize: _.get(NOTIFICATION_TEXT, `style.fontSize`, 11),
      fontWeight: _.get(NOTIFICATION_TEXT, `style.fontWeight`, 500),
      lineHeight: _.get(NOTIFICATION_TEXT, `style.lineHeightPx`, 20),
      gap: _.get(NOTIFICATION_OPENED, `itemSpacing`, 10),
      paddingTop: _.get(NOTIFICATION_OPENED, `paddingTop`, 0),
      paddingRight: _.get(NOTIFICATION_OPENED, `paddingRight`, 5),
      paddingBottom: _.get(NOTIFICATION_OPENED, `paddingBottom`, 0),
      paddingLeft: _.get(NOTIFICATION_OPENED, `paddingLeft`, 5),
      color: `rgba(${main.rgbaObj(
        _.get(NOTIFICATION_TEXT, `fills[0].color.r`, 1)
      )}, ${main.rgbaObj(
        _.get(NOTIFICATION_TEXT, `fills[0].color.g`, 1)
      )}, ${main.rgbaObj(
        _.get(NOTIFICATION_TEXT, `fills[0].color.b`, 1)
      )}, ${main.roundToDecimal(
        _.get(NOTIFICATION_TEXT, `fills[0].color.a`, 1),
        2
      )})`,
    },
    opened: {
      borderWidth: _.get(NOTIFICATION_OPENED, `strokeWeight`, 1),
      borderType: _.get(NOTIFICATION_OPENED, `strokes[0].type`, "solid"),
      borderColor: `rgba(${main.rgbaObj(
        _.get(NOTIFICATION_OPENED, `strokes[0].color.r`, 0)
      )}, ${main.rgbaObj(
        _.get(NOTIFICATION_OPENED, `strokes[0].color.g`, 0)
      )}, ${main.rgbaObj(
        _.get(NOTIFICATION_OPENED, `strokes[0].color.b`, 0)
      )}, ${main.roundToDecimal(
        _.get(NOTIFICATION_OPENED, `strokes[0].opacity`, 1),
        2
      )})`,
      backgroundColor: `rgba(${main.rgbaObj(
        _.get(NOTIFICATION_OPENED, `backgroundColor.r`, 1)
      )}, ${main.rgbaObj(
        _.get(NOTIFICATION_OPENED, `backgroundColor.g`, 0.34)
      )}, ${main.rgbaObj(
        _.get(NOTIFICATION_OPENED, `backgroundColor.b`, 0.34)
      )}, ${main.roundToDecimal(
        _.get(NOTIFICATION_OPENED, `backgroundColor.a`, 1),
        2
      )})`,
    },
    closed: {
      backgroundColor: `rgba(${main.rgbaObj(
        _.get(NOTIFICATION_CLOSED, `backgroundColor.r`, 1)
      )}, ${main.rgbaObj(
        _.get(NOTIFICATION_CLOSED, `backgroundColor.g`, 0.34)
      )}, ${main.rgbaObj(
        _.get(NOTIFICATION_CLOSED, `backgroundColor.b`, 0.34)
      )}, ${main.roundToDecimal(
        _.get(NOTIFICATION_CLOSED, `backgroundColor.a`, 1),
        2
      )})`,
    },
  };

  Object.assign(notificationData, DATA);

  return notificationData;
};

exports.getNotificationData = getNotificationData;