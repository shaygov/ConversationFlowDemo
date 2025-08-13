const main = require("../../../magic");
const _ = require("lodash");

const getChatBubble = (dataArr) => {
  const chatBubble = {};
  
  const content = main.findArrayById(dataArr, "560:16417");
  const avatarComment = main.findArrayById(dataArr, "560:16418");
  const avatarNameTimestamp = main.findArrayById(dataArr, "560:16419");
  const avatarNameTimestampTop = main.findArrayById(dataArr, "1028:20449");
  const nameWrapper = main.findArrayById(dataArr, "560:16421");
  const nameInner = main.findArrayById(dataArr, "560:16422");
  const name = main.findArrayById(dataArr, "560:16423");
  const nameText = main.findArrayById(dataArr, "560:16424");
  const timeText = main.findArrayById(dataArr, "560:14209");
  const lastReplyText = main.findArrayById(dataArr, "560:16270");
  
  const textWrapper = main.findArrayById(dataArr, "560:16432");
  const textInner = main.findArrayById(dataArr, "560:16433");
  const text = main.findArrayById(dataArr, "560:16434");

  const commentBadge = main.findArrayById(dataArr, "560:16429");
  const commentBadgeWrapper = main.findArrayById(dataArr, "I560:16429;910:5");
  const commentBadgeLeftText = main.findArrayById(dataArr, "I560:16429;910:3");
  const commentBadgeRightText = main.findArrayById(dataArr, "I560:16429;910:4");
  
  const hoverBlock = main.findArrayById(dataArr, "560:14145");
  
  const avatarsText = main.findArrayById(dataArr, "560:16492");
  
  const DATA = {
    content: {
      gap: _.get(content, `itemSpacing`, 12),
      paddingTop: _.get(content, `paddingTop`, 12),
      paddingRight: _.get(content, `paddingRight`, 10),
      paddingBottom: _.get(content, `paddingBottom`, 12),
      paddingLeft: _.get(content, `paddingLeft`, 10),
      borderRadius: _.get(content, `cornerRadius`, 5),
      backgroundColor: `rgba(${main.rgbaObj(
        _.get(content, `backgroundColor.r`, 1)
      )}, ${main.rgbaObj(
        _.get(content, `backgroundColor.g`, 1)
      )}, ${main.rgbaObj(
        _.get(content, `backgroundColor.b`, 1)
      )}, ${main.roundToDecimal(
        _.get(content, `backgroundColor.a`, 0.03),
        2
      )})`
    },
    avatarComment: {
      borderRadius: _.get(avatarComment, `cornerRadius`, 5),
      gap: _.get(avatarComment, `itemSpacing`, 5),
      avatarNameTimestampTop: {
        gap: _.get(avatarNameTimestampTop, `itemSpacing`, 12),
        avatarNameTimestamp: {
          gap: _.get(avatarNameTimestamp, `itemSpacing`, 10),
          nameWrapper: {
            gap: _.get(nameWrapper, `itemSpacing`, 2),
            nameInner: {
              gap: _.get(nameInner, `itemSpacing`, 10),
              name: {
                gap: _.get(name, `itemSpacing`, 10),
                text: {
                  fontSize: _.get(nameText, `style.fontSize`, 14),
                  fontWeight: _.get(nameText, `style.fontWeight`, 500),
                  lineHeight: _.get(nameText, `style.lineHeightPx`, 22),
                  color: `rgba(${main.rgbaObj(
                    _.get(nameText, `fills[0].color.r`, 1)
                  )}, ${main.rgbaObj(
                    _.get(nameText, `fills[0].color.g`, 1)
                  )}, ${main.rgbaObj(
                    _.get(nameText, `fills[0].color.b`, 1)
                  )}, ${main.roundToDecimal(_.get(nameText, `opacity`, 1), 2)})`
                },
                timeText: {
                  fontSize: _.get(timeText, `style.fontSize`, 12),
                  fontWeight: _.get(timeText, `style.fontWeight`, 400),
                  lineHeight: _.get(timeText, `style.lineHeightPx`, 18),
                  color: `rgba(${main.rgbaObj(
                    _.get(timeText, `fills[0].color.r`, 1)
                  )}, ${main.rgbaObj(
                    _.get(timeText, `fills[0].color.g`, 1)
                  )}, ${main.rgbaObj(
                    _.get(timeText, `fills[0].color.b`, 1)
                  )}, ${main.roundToDecimal(_.get(timeText, `opacity`, 0.55), 2)})`
                }
              }
            }
          }
        },
        textWrapper: {
          gap: _.get(textWrapper, `itemSpacing`, 10),
          textInner: {
            gap: _.get(textInner, `itemSpacing`, 2),
            paddingTop: _.get(textInner, `paddingTop`, 0),
            paddingRight: _.get(textInner, `paddingRight`, 0),
            paddingBottom: _.get(textInner, `paddingBottom`, 0),
            paddingLeft: _.get(textInner, `paddingLeft`, 56),
            text: {
              fontSize: _.get(text, `style.fontSize`, 14),
              fontWeight: _.get(text, `style.fontWeight`, 400),
              lineHeight: _.get(text, `style.lineHeightPx`, 22),
              color: `rgba(${main.rgbaObj(
                _.get(text, `fills[0].color.r`, 1)
              )}, ${main.rgbaObj(
                _.get(text, `fills[0].color.g`, 1)
              )}, ${main.rgbaObj(
                _.get(text, `fills[0].color.b`, 1)
              )}, ${main.roundToDecimal(_.get(text, `opacity`, 1), 2)})`
            }
          }
        },
      },
      avatarsText: {
        gap: _.get(avatarsText, `itemSpacing`, 10),
        paddingTop: _.get(avatarsText, `paddingTop`, 0),
        paddingRight: _.get(avatarsText, `paddingRight`, 0),
        paddingBottom: _.get(avatarsText, `paddingBottom`, 0),
        paddingLeft: _.get(avatarsText, `paddingLeft`, 55),
        lastReplyText: {
          fontSize: _.get(lastReplyText, `style.fontSize`, 12),
          fontWeight: _.get(lastReplyText, `style.fontWeight`, 400),
          lineHeight: _.get(lastReplyText, `style.lineHeightPx`, 18),
          color: `rgba(${main.rgbaObj(
            _.get(lastReplyText, `fills[0].color.r`, 0.54)
          )}, ${main.rgbaObj(
            _.get(lastReplyText, `fills[0].color.g`, 0.54)
          )}, ${main.rgbaObj(
            _.get(lastReplyText, `fills[0].color.b`, 0.54)
          )}, ${main.roundToDecimal(_.get(lastReplyText, `opacity`, 1), 2)})`
        }
      }
    },
    commentBadge: {
      height: _.get(commentBadge, `absoluteBoundingBox.height`, 18),
      gap: _.get(commentBadge, `itemSpacing`, 8),
      paddingTop: _.get(commentBadge, `paddingTop`, 0),
      paddingRight: _.get(commentBadge, `paddingRight`, 4),
      paddingBottom: _.get(commentBadge, `paddingBottom`, 0),
      paddingLeft: _.get(commentBadge, `paddingLeft`, 4),
      borderRadius: _.get(commentBadge, `cornerRadius`, 5),
      backgroundColor: `rgba(${main.rgbaObj(
        _.get(commentBadge, `backgroundColor.r`, 0.3)
      )}, ${main.rgbaObj(
        _.get(commentBadge, `backgroundColor.g`, 0.3)
      )}, ${main.rgbaObj(
        _.get(commentBadge, `backgroundColor.b`, 0.3)
      )}, ${main.roundToDecimal(
        _.get(commentBadge, `backgroundColor.a`, 1),
        2
      )})`,
      wrapper: {
        gap: _.get(commentBadgeWrapper, `itemSpacing`, 5),
        leftText: {
          fontSize: _.get(commentBadgeLeftText, `style.fontSize`, 11),
          fontWeight: _.get(commentBadgeLeftText, `style.fontWeight`, 600),
          lineHeight: _.get(commentBadgeLeftText, `style.lineHeightPx`, 18),
          color: `rgba(${main.rgbaObj(
            _.get(commentBadgeLeftText, `fills[0].color.r`, 0.54)
          )}, ${main.rgbaObj(
            _.get(commentBadgeLeftText, `fills[0].color.g`, 0.54)
          )}, ${main.rgbaObj(
            _.get(commentBadgeLeftText, `fills[0].color.b`, 0.57)
          )}, ${main.roundToDecimal(_.get(commentBadgeLeftText, `opacity`, 0.8), 2)})`
        },
        rightText: {
          fontSize: _.get(commentBadgeRightText, `style.fontSize`, 11),
          fontWeight: _.get(commentBadgeRightText, `style.fontWeight`, 600),
          lineHeight: _.get(commentBadgeRightText, `style.lineHeightPx`, 18),
          color: `rgba(${main.rgbaObj(
            _.get(commentBadgeRightText, `fills[0].color.r`, 0.54)
          )}, ${main.rgbaObj(
            _.get(commentBadgeRightText, `fills[0].color.g`, 0.54)
          )}, ${main.rgbaObj(
            _.get(commentBadgeRightText, `fills[0].color.b`, 0.57)
          )}, ${main.roundToDecimal(_.get(commentBadgeRightText, `opacity`, 1), 2)})`
        }
      }
    },
    hoverBlock: {
      backgroundColor: `rgba(${main.rgbaObj(
        _.get(hoverBlock, `backgroundColor.r`, 1)
      )}, ${main.rgbaObj(
        _.get(hoverBlock, `backgroundColor.g`, 1)
      )}, ${main.rgbaObj(
        _.get(hoverBlock, `backgroundColor.b`, 1)
      )}, ${main.roundToDecimal(
        _.get(hoverBlock, `backgroundColor.a`, 0.04),
        2
      )})`
    }
  };

  Object.assign(chatBubble, DATA);

  return chatBubble;
};

exports.getChatBubble = getChatBubble;