const main = require("../../../magic");
const _ = require("lodash");

const getChatInput = (dataArr) => {
  const chatInputObj = {};
  
  const chatInput = main.findArrayById(dataArr, "544:30018");
  const chatInputInner = main.findArrayById(dataArr, "544:28865");
  const iconText = main.findArrayById(dataArr, "544:28866");
  const icon = main.findArrayById(dataArr, "544:28867");
  const text = main.findArrayById(dataArr, "544:28868");
  const formating = main.findArrayById(dataArr, "544:28869");

  const DATA = {
    wrapper: {
      gap: _.get(chatInput, `itemSpacing`, 10),
      paddingTop: _.get(chatInput, `paddingTop`, 10),
      paddingRight: _.get(chatInput, `paddingRight`, 1),
      paddingBottom: _.get(chatInput, `paddingBottom`, 10),
      paddingLeft: _.get(chatInput, `paddingLeft`, 1),
      borderRadius: _.get(chatInput, `cornerRadius`, 5),
      backgroundColor: `rgba(${main.rgbaObj(
        _.get(chatInput, `backgroundColor.r`, 1)
      )}, ${main.rgbaObj(
        _.get(chatInput, `backgroundColor.g`, 1)
      )}, ${main.rgbaObj(
        _.get(chatInput, `backgroundColor.b`, 1)
      )}, ${main.roundToDecimal(
        _.get(chatInput, `backgroundColor.a`, 0.1),
        2
      )})`,
      border: {
        borderWidth: _.get(chatInput, `strokeWeight`, 1),
        borderType: _.get(chatInput, `strokes[0].type`, "solid"),
        borderColor: `rgba(${main.rgbaObj(
          _.get(chatInput, `strokes[0].color.r`, 0.95)
        )}, ${main.rgbaObj(
          _.get(chatInput, `strokes[0].color.g`, 0.95)
        )}, ${main.rgbaObj(
          _.get(chatInput, `strokes[0].color.b`, 0.95)
        )}, ${main.roundToDecimal(
          _.get(chatInput, `strokes[0].opacity`, 0.09),
          2
        )})`,
      },
    },
    inner: {
      gap: _.get(chatInput, `itemSpacing`, 10),
      paddingTop: _.get(chatInputInner, `paddingTop`, 0),
      paddingRight: _.get(chatInputInner, `paddingRight`, 15),
      paddingBottom: _.get(chatInputInner, `paddingBottom`, 0),
      paddingLeft: _.get(chatInputInner, `paddingLeft`, 10),
    },
    iconText: {      
      gap: _.get(iconText, `itemSpacing`, 10),
      iconOpacity: main.roundToDecimal(_.get(iconText, `opacity`, 0.8), 2),
      text: {
        fontSize: _.get(text, `style.fontSize`, 13),
        fontWeight: _.get(text, `style.fontWeight`, 400),
        lineHeight: _.get(text, `style.lineHeightPx`, 18),
        color: `rgba(${main.rgbaObj(
          _.get(text, `fills[0].color.r`, 1)
        )}, ${main.rgbaObj(
          _.get(text, `fills[0].color.g`, 1)
        )}, ${main.rgbaObj(
          _.get(text, `fills[0].color.b`, 1)
        )}, ${main.roundToDecimal(_.get(text, `opacity`, 0.4), 2)})`
      },
    },
    formating: {
      gap: _.get(formating, `itemSpacing`, 12),
      opacity: main.roundToDecimal(_.get(formating, `opacity`, 0.3), 2),
    }
  };

  Object.assign(chatInputObj, DATA);

  return chatInputObj;
};

exports.getChatInput = getChatInput;