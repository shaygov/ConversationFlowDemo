const main = require("../../../magic");
const _ = require("lodash");

const getSidebarRowData = (dataArr) => {
  const sidebarRowData = {};

  const SIDEBAR_ROW_TYPE_DEFAULT = main.findArrayById(dataArr, "16:3918");
  const SIDEBAR_ROW_TYPE_NEW_MESSAGES = main.findArrayById(dataArr, "17:6472");
  const SIDEBAR_ROW_TYPE_NEW_MENTION_INNER = main.findArrayById(
    dataArr,
    "516:27741"
  );
  const SIDEBAR_ROW_TYPE_DEFAULT_STATE_ACTIVE_INNER = main.findArrayById(
    dataArr,
    "516:27843"
  );
  const SIDEBAR_ROW_TYPE_DEFAULT_STATE_ACTIVE_TEXT = main.findArrayById(
    dataArr,
    "516:27858"
  );
  const SIDEBAR_ROW_DEFAULT_HOVERED_TEXT = main.findArrayById(
    dataArr,
    "21:19116"
  );
  const SIDEBAR_ROW_CLOSE_ICON = main.findArrayById(dataArr, "25:22006");
  const sidebar_row_inner = main.findArrayById(dataArr, "16:3499");
  const sidebar_row_name_number = main.findArrayById(dataArr, "516:27756");
  const sidebar_row_inner_hovered = main.findArrayById(dataArr, "21:19101");

  const rectangle_icon = main.findArrayById(dataArr, "16:3501");
  const channel = main.findArrayById(dataArr, "16:3960");
  // const user = main.findArrayById(dataArr, "16:3966");
  const icon_only = main.findArrayById(dataArr, "17:3970");
  const solution = main.findArrayById(dataArr, "17:3977");
  const fontDefault = main.findArrayById(dataArr, "16:3504");
  const fontNewMessages = main.findArrayById(dataArr, "17:6488");
  const fontNewMention = main.findArrayById(dataArr, "516:27757");

  const DATA = {
    types: {
      default: {
        wrapper: {
          gap: _.get(SIDEBAR_ROW_TYPE_DEFAULT, `itemSpacing`, 10),
          paddingTop: _.get(SIDEBAR_ROW_TYPE_DEFAULT, `paddingTop`, 1),
          paddingRight: _.get(SIDEBAR_ROW_TYPE_DEFAULT, `paddingRight`, 10),
          paddingBottom: _.get(SIDEBAR_ROW_TYPE_DEFAULT, `paddingBottom`, 1),
          paddingLeft: _.get(SIDEBAR_ROW_TYPE_DEFAULT, `paddingLeft`, 10)
        },
        inner: {
          paddingTop: _.get(sidebar_row_inner, `paddingTop`, 5),
          paddingRight: _.get(sidebar_row_inner, `paddingRight`, 5),
          paddingBottom: _.get(sidebar_row_inner, `paddingBottom`, 5),
          paddingLeft: _.get(sidebar_row_inner, `paddingLeft`, 5),
          borderRadius: _.get(sidebar_row_inner, `cornerRadius`, 6),
          gap: _.get(sidebar_row_inner, `itemSpacing`, 12)
        },
        nameNumber: {
          paddingLeft: _.get(sidebar_row_name_number, `paddingLeft`, 5),
          gap: _.get(sidebar_row_name_number, `itemSpacing`, 6)
        },
        text: {
          fontSize: _.get(fontDefault, `style.fontSize`, 14),
          fontFamily: _.get(fontDefault, `style.fontFamily`, "SF Pro Text"),
          fontWeight: _.get(fontDefault, `style.fontWeight`, 400),
          lineHeight: _.get(fontDefault, `style.lineHeightPx`, 20),
          color: `rgba(${main.rgbaObj(
            _.get(fontDefault, `fills[0].color.r`, 1)
          )}, ${main.rgbaObj(
            _.get(fontDefault, `fills[0].color.g`, 1)
          )}, ${main.rgbaObj(
            _.get(fontDefault, `fills[0].color.b`, 1)
          )}, ${main.roundToDecimal(_.get(fontDefault, `opacity`, 0.7), 2)})`
        },
        stateHover: {
          inner: {
            backgroundColor: `rgba(${main.rgbaObj(
              _.get(sidebar_row_inner_hovered, `backgroundColor.r`, 1)
            )}, ${main.rgbaObj(
              _.get(sidebar_row_inner_hovered, `backgroundColor.g`, 1)
            )}, ${main.rgbaObj(
              _.get(sidebar_row_inner_hovered, `backgroundColor.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(sidebar_row_inner_hovered, `backgroundColor.a`, 0.1),
              2
            )})`
          },
          text: {
            color: `rgba(${main.rgbaObj(
              _.get(SIDEBAR_ROW_DEFAULT_HOVERED_TEXT, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(SIDEBAR_ROW_DEFAULT_HOVERED_TEXT, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(SIDEBAR_ROW_DEFAULT_HOVERED_TEXT, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(SIDEBAR_ROW_DEFAULT_HOVERED_TEXT, `fills[0].color.a`, 1),
              2
            )})`
          }
        },
        stateActive: {
          inner: {
            backgroundColor: `rgba(${main.rgbaObj(
              _.get(SIDEBAR_ROW_TYPE_DEFAULT_STATE_ACTIVE_INNER, `backgroundColor.r`, 1)
            )}, ${main.rgbaObj(
              _.get(SIDEBAR_ROW_TYPE_DEFAULT_STATE_ACTIVE_INNER, `backgroundColor.g`, 1)
            )}, ${main.rgbaObj(
              _.get(SIDEBAR_ROW_TYPE_DEFAULT_STATE_ACTIVE_INNER, `backgroundColor.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(SIDEBAR_ROW_TYPE_DEFAULT_STATE_ACTIVE_INNER, `backgroundColor.a`, 0.1),
              2
            )})`
          },
          text: {
            fontWeight: _.get(SIDEBAR_ROW_TYPE_DEFAULT_STATE_ACTIVE_TEXT, `style.fontWeight`, 400),
            color: `rgba(${main.rgbaObj(
              _.get(SIDEBAR_ROW_TYPE_DEFAULT_STATE_ACTIVE_TEXT, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(SIDEBAR_ROW_TYPE_DEFAULT_STATE_ACTIVE_TEXT, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(SIDEBAR_ROW_TYPE_DEFAULT_STATE_ACTIVE_TEXT, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(SIDEBAR_ROW_TYPE_DEFAULT_STATE_ACTIVE_TEXT, `fills[0].color.a`, 1),
              2
            )})`
          }
        }
      },
      badge: {
        text: {
          fontSize: _.get(fontNewMessages, `style.fontSize`, 14),
          fontFamily: _.get(fontNewMessages, `style.fontFamily`, "SF Pro Text"),
          fontWeight: _.get(fontNewMessages, `style.fontWeight`, 400),
          lineHeight: _.get(fontNewMessages, `style.lineHeightPx`, 20),
          color: `rgba(${main.rgbaObj(
            _.get(fontNewMessages, `fills[0].color.r`, 1)
          )}, ${main.rgbaObj(
            _.get(fontNewMessages, `fills[0].color.g`, 1)
          )}, ${main.rgbaObj(
            _.get(fontNewMessages, `fills[0].color.b`, 1)
          )}, ${main.roundToDecimal(_.get(fontNewMessages, `opacity`, 1), 2)})`
        }
      },
      newMention: {
        text: {
          fontSize: _.get(fontNewMention, `style.fontSize`, 14),
          fontFamily: _.get(fontNewMention, `style.fontFamily`, "SF Pro Text"),
          fontWeight: _.get(fontNewMention, `style.fontWeight`, 400),
          lineHeight: _.get(fontNewMention, `style.lineHeightPx`, 20),
          color: `rgba(${main.rgbaObj(
            _.get(fontNewMention, `fills[0].color.r`, 1)
          )}, ${main.rgbaObj(
            _.get(fontNewMention, `fills[0].color.g`, 1)
          )}, ${main.rgbaObj(
            _.get(fontNewMention, `fills[0].color.b`, 1)
          )}, ${main.roundToDecimal(_.get(fontNewMention, `opacity`, 1), 2)})`
        },
        inner: {
          backgroundColor: `rgba(${main.rgbaObj(
            _.get(SIDEBAR_ROW_TYPE_NEW_MENTION_INNER, `backgroundColor.r`, 1)
          )}, ${main.rgbaObj(
            _.get(SIDEBAR_ROW_TYPE_NEW_MENTION_INNER, `backgroundColor.g`, 1)
          )}, ${main.rgbaObj(
            _.get(SIDEBAR_ROW_TYPE_NEW_MENTION_INNER, `backgroundColor.b`, 1)
          )}, ${main.roundToDecimal(
            _.get(
              SIDEBAR_ROW_TYPE_NEW_MENTION_INNER,
              `backgroundColor.a`,
              0.05
            ),
            2
          )})`
        }
      }
    },
    options: {
      rectangleIcon: {
        width: _.get(rectangle_icon, `absoluteBoundingBox.width`, 18),
        height: _.get(rectangle_icon, `absoluteBoundingBox.height`, 18),
        borderRadius: _.get(rectangle_icon, `cornerRadius`, 4),
        gap: _.get(rectangle_icon, `itemSpacing`, 10),
        paddingTop: _.get(rectangle_icon, `paddingTop`, 5),
        paddingRight: _.get(rectangle_icon, `paddingRight`, 5),
        paddingBottom: _.get(rectangle_icon, `paddingBottom`, 5),
        paddingLeft: _.get(rectangle_icon, `paddingLeft`, 5)
      },
      channel: {
        opacity: main.roundToDecimal(_.get(channel, `opacity`, 0.3), 2),
        borderRadius: _.get(channel, `cornerRadius`, 50),
        gap: _.get(channel, `itemSpacing`, 12)
      },
      iconOnly: {
        gap: _.get(icon_only, `itemSpacing`, 10)
      },
      solution: {
        borderRadius: _.get(solution, `cornerRadius`, 4),
        gap: _.get(solution, `itemSpacing`, 10),
        paddingTop: _.get(solution, `paddingTop`, 4),
        paddingRight: _.get(solution, `paddingRight`, 4),
        paddingBottom: _.get(solution, `paddingBottom`, 4),
        paddingLeft: _.get(solution, `paddingLeft`, 4)
      }
    },
    closeIcon: {
      opacity: main.roundToDecimal(
        _.get(SIDEBAR_ROW_CLOSE_ICON, `opacity`, 0.3),
        2
      ),
      width: _.get(SIDEBAR_ROW_CLOSE_ICON, `absoluteBoundingBox.width`, 16),
      height: _.get(SIDEBAR_ROW_CLOSE_ICON, `absoluteBoundingBox.height`, 16)
    }
  };

  Object.assign(sidebarRowData, DATA);

  return sidebarRowData;
};

exports.getSidebarRowData = getSidebarRowData;
