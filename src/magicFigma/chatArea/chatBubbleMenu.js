const main = require("../../../magic");
const _ = require("lodash");

const getChatBubbleMenu = (dataArr) => {
  const chatBubbleMenu = {};
  
  const chatBubbleMenuRight = main.findArrayById(dataArr, "547:35623");
  const chatBubbleMenuRightIcon = main.findArrayById(dataArr, "547:35630");

  const DATA = {
    menu: {
      borderRadius: _.get(chatBubbleMenuRight, `cornerRadius`, 6),
      gap: _.get(chatBubbleMenuRight, `itemSpacing`, 8),
      paddingTop: _.get(chatBubbleMenuRight, `paddingTop`, 5),
      paddingRight: _.get(chatBubbleMenuRight, `paddingRight`, 6),
      paddingBottom: _.get(chatBubbleMenuRight, `paddingBottom`, 5),
      paddingLeft: _.get(chatBubbleMenuRight, `paddingLeft`, 6),
      backgroundColor: `rgba(${main.rgbaObj(
        _.get(chatBubbleMenuRight, `background[0].color.r`, 0)
      )}, ${main.rgbaObj(
        _.get(chatBubbleMenuRight, `background[0].color.g`, 0)
      )}, ${main.rgbaObj(
        _.get(chatBubbleMenuRight, `background[0].color.b`, 0)
      )}, ${main.roundToDecimal(
        _.get(chatBubbleMenuRight, `background[0].color.a`, 0.06),
        2
      )})`,
      border: {
        borderWidth: _.get(chatBubbleMenuRight, `strokeWeight`, 1),
        borderType: _.get(chatBubbleMenuRight, `strokes[0].type`, "solid"),
        borderColor: `rgba(${main.rgbaObj(
          _.get(chatBubbleMenuRight, `strokes[0].color.r`, 0)
        )}, ${main.rgbaObj(
          _.get(chatBubbleMenuRight, `strokes[0].color.g`, 0)
        )}, ${main.rgbaObj(
          _.get(chatBubbleMenuRight, `strokes[0].color.b`, 0)
        )}, ${main.roundToDecimal(
          _.get(chatBubbleMenuRight, `strokes[0].opacity`, 0.1),
          2
        )})`,
      },
      icon: {
        borderRadius: _.get(chatBubbleMenuRightIcon, `cornerRadius`, 3),
        gap: _.get(chatBubbleMenuRightIcon, `itemSpacing`, 10),
        paddingTop: _.get(chatBubbleMenuRightIcon, `paddingTop`, 4),
        paddingRight: _.get(chatBubbleMenuRightIcon, `paddingRight`, 4),
        paddingBottom: _.get(chatBubbleMenuRightIcon, `paddingBottom`, 4),
        paddingLeft: _.get(chatBubbleMenuRightIcon, `paddingLeft`, 4)
      }
    },
  };

  Object.assign(chatBubbleMenu, DATA);

  return chatBubbleMenu;
};

exports.getChatBubbleMenu = getChatBubbleMenu;