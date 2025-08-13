const main = require("../../../magic");
const _ = require("lodash");

const getChatBubbleThread = (dataArr) => {
  const chatBubbleThread = {};
  
  const threadPersonalMessage = main.findArrayById(dataArr, "549:15479");
  const threadPersonalMessageHover = main.findArrayById(dataArr, "560:22211");
  const personalMessage = main.findArrayById(dataArr, "556:15544");
  const personalMessageText = main.findArrayById(dataArr, "556:15545");
  const personalMessageHover = main.findArrayById(dataArr, "556:15523");
  const personalMessageBlockHover = main.findArrayById(dataArr, "551:14148");
  const comment = main.findArrayById(dataArr, "560:16153");
  const commentText = main.findArrayById(dataArr, "560:16159");
  const commentHover = main.findArrayById(dataArr, "560:16176");
  const commentBlockHover = main.findArrayById(dataArr, "560:16165");
  const commentAvatarWrapper = main.findArrayById(dataArr, "560:16155");

  const DATA = {
    threadPersonalMessage: {
      gap: _.get(threadPersonalMessage, `itemSpacing`, 8),
      borderRadius: _.get(threadPersonalMessage, `cornerRadius`, 6),
      paddingTop: _.get(threadPersonalMessage, `paddingTop`, 5),
      paddingRight: _.get(threadPersonalMessage, `paddingRight`, 6),
      paddingBottom: _.get(threadPersonalMessage, `paddingBottom`, 5),
      paddingLeft: _.get(threadPersonalMessage, `paddingLeft`, 6),
      backgroundColor: `rgba(${main.rgbaObj(
        _.get(threadPersonalMessage, `background[0].color.r`, 0.25)
      )}, ${main.rgbaObj(
        _.get(threadPersonalMessage, `background[0].color.g`, 0.25)
      )}, ${main.rgbaObj(
        _.get(threadPersonalMessage, `background[0].color.b`, 0.25)
      )}, ${main.roundToDecimal(
        _.get(threadPersonalMessage, `background[0].color.a`, 1),
        2
      )})`,
      border: {
        borderWidth: _.get(threadPersonalMessage, `strokeWeight`, 1),
        borderType: _.get(threadPersonalMessage, `strokes[0].type`, "solid"),
        borderColor: `rgba(${main.rgbaObj(
          _.get(threadPersonalMessage, `strokes[0].color.r`, 1)
        )}, ${main.rgbaObj(
          _.get(threadPersonalMessage, `strokes[0].color.g`, 1)
        )}, ${main.rgbaObj(
          _.get(threadPersonalMessage, `strokes[0].color.b`, 1)
        )}, ${main.roundToDecimal(
          _.get(threadPersonalMessage, `strokes[0].opacity`, 0.1),
          2
        )})`
      },
      hover: {
        border: {
          borderColor: `rgba(${main.rgbaObj(
            _.get(threadPersonalMessageHover, `strokes[0].color.r`, 1)
          )}, ${main.rgbaObj(
            _.get(threadPersonalMessageHover, `strokes[0].color.g`, 1)
          )}, ${main.rgbaObj(
            _.get(threadPersonalMessageHover, `strokes[0].color.b`, 1)
          )}, ${main.roundToDecimal(
            _.get(threadPersonalMessageHover, `strokes[0].opacity`, 0.41),
            2
          )})`
        }
      }
    },
    personalMessage: {
      gap: _.get(personalMessage, `itemSpacing`, 8),
      borderRadius: _.get(personalMessage, `cornerRadius`, 6),
      paddingTop: _.get(personalMessage, `paddingTop`, 4),
      paddingRight: _.get(personalMessage, `paddingRight`, 10),
      paddingBottom: _.get(personalMessage, `paddingBottom`, 4),
      paddingLeft: _.get(personalMessage, `paddingLeft`, 10),
      border: {
        borderWidth: _.get(personalMessage, `strokeWeight`, 1),
        borderType: _.get(personalMessage, `strokes[0].type`, "solid"),
      },
      text: {
        fontSize: _.get(personalMessageText, `style.fontSize`, 10),
        fontWeight: _.get(personalMessageText, `style.fontWeight`, 500),
        lineHeight: _.get(personalMessageText, `style.lineHeightPx`, 16),
        color: `rgba(${main.rgbaObj(
          _.get(personalMessageText, `fills[0].color.r`, 1)
        )}, ${main.rgbaObj(
          _.get(personalMessageText, `fills[0].color.g`, 1)
        )}, ${main.rgbaObj(
          _.get(personalMessageText, `fills[0].color.b`, 1)
        )}, ${main.roundToDecimal(_.get(personalMessageText, `opacity`, 1), 2)})`
      },
      blockHover: {
        backgroundColor: `rgba(${main.rgbaObj(
          _.get(personalMessageBlockHover, `background[0].color.r`, 0.25)
        )}, ${main.rgbaObj(
          _.get(personalMessageBlockHover, `background[0].color.g`, 0.25)
        )}, ${main.rgbaObj(
          _.get(personalMessageBlockHover, `background[0].color.b`, 0.25)
        )}, ${main.roundToDecimal(
          _.get(personalMessageBlockHover, `background[0].color.a`, 1),
          2
        )})`,
        border: {
          borderColor: `rgba(${main.rgbaObj(
            _.get(personalMessageBlockHover, `strokes[0].color.r`, 1)
          )}, ${main.rgbaObj(
            _.get(personalMessageBlockHover, `strokes[0].color.g`, 1)
          )}, ${main.rgbaObj(
            _.get(personalMessageBlockHover, `strokes[0].color.b`, 1)
          )}, ${main.roundToDecimal(
            _.get(personalMessageBlockHover, `strokes[0].opacity`, 0.12),
            2
          )})`
        }
      },
      hover: {
        border: {
          borderColor: `rgba(${main.rgbaObj(
            _.get(personalMessageHover, `strokes[0].color.r`, 1)
          )}, ${main.rgbaObj(
            _.get(personalMessageHover, `strokes[0].color.g`, 1)
          )}, ${main.rgbaObj(
            _.get(personalMessageHover, `strokes[0].color.b`, 1)
          )}, ${main.roundToDecimal(
            _.get(personalMessageHover, `strokes[0].opacity`, 0.31),
            2
          )})`
        }
      }
    },
    comment: {
      gap: _.get(comment, `itemSpacing`, 8),
      borderRadius: _.get(comment, `cornerRadius`, 6),
      paddingTop: _.get(comment, `paddingTop`, 4),
      paddingRight: _.get(comment, `paddingRight`, 10),
      paddingBottom: _.get(comment, `paddingBottom`, 4),
      paddingLeft: _.get(comment, `paddingLeft`, 10),
      border: {
        borderWidth: _.get(comment, `strokeWeight`, 1),
        borderType: _.get(comment, `strokes[0].type`, "solid"),
      },
      text: {
        fontSize: _.get(commentText, `style.fontSize`, 10),
        fontWeight: _.get(commentText, `style.fontWeight`, 500),
        lineHeight: _.get(commentText, `style.lineHeightPx`, 16),
        color: `rgba(${main.rgbaObj(
          _.get(commentText, `fills[0].color.r`, 1)
        )}, ${main.rgbaObj(
          _.get(commentText, `fills[0].color.g`, 1)
        )}, ${main.rgbaObj(
          _.get(commentText, `fills[0].color.b`, 1)
        )}, ${main.roundToDecimal(_.get(commentText, `opacity`, 1), 2)})`
      },
      avatarWrapper: {      
        gap: _.get(commentAvatarWrapper, `itemSpacing`, 4)
      },
      blockHover: {
        backgroundColor: `rgba(${main.rgbaObj(
          _.get(commentBlockHover, `background[0].color.r`, 0.25)
        )}, ${main.rgbaObj(
          _.get(commentBlockHover, `background[0].color.g`, 0.25)
        )}, ${main.rgbaObj(
          _.get(commentBlockHover, `background[0].color.b`, 0.25)
        )}, ${main.roundToDecimal(
          _.get(commentBlockHover, `background[0].color.a`, 1),
          2
        )})`,
        border: {
          borderColor: `rgba(${main.rgbaObj(
            _.get(commentBlockHover, `strokes[0].color.r`, 1)
          )}, ${main.rgbaObj(
            _.get(commentBlockHover, `strokes[0].color.g`, 1)
          )}, ${main.rgbaObj(
            _.get(commentBlockHover, `strokes[0].color.b`, 1)
          )}, ${main.roundToDecimal(
            _.get(commentBlockHover, `strokes[0].opacity`, 0.12),
            2
          )})`
        }
      },
      hover: {
        border: {
          borderColor: `rgba(${main.rgbaObj(
            _.get(commentHover, `strokes[0].color.r`, 1)
          )}, ${main.rgbaObj(
            _.get(commentHover, `strokes[0].color.g`, 1)
          )}, ${main.rgbaObj(
            _.get(commentHover, `strokes[0].color.b`, 1)
          )}, ${main.roundToDecimal(
            _.get(commentHover, `strokes[0].opacity`, 0.31),
            2
          )})`
        }
      }
    }
  };

  Object.assign(chatBubbleThread, DATA);

  return chatBubbleThread;
};

exports.getChatBubbleThread = getChatBubbleThread;