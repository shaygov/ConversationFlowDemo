const main = require("../../../magic");
const _ = require("lodash");

const getSubSidebarRowData = (dataArr) => {
  const subSidebarRowData = {};

  // In App - App -> Default
  const inAppAppDefault = main.findArrayById(dataArr, "57:22386");
  const inAppAppDefaultInner = main.findArrayById(dataArr, "16:3283");
  const inAppAppDefaultInnerHovered = main.findArrayById(dataArr, "57:22643");
  const inAppAppDefaultLabelOuter = main.findArrayById(dataArr, "16:3284");
  const inAppAppDefaultLabelInner = main.findArrayById(dataArr, "57:22593");
  const inAppAppDefaultText = main.findArrayById(dataArr, "16:3286");
  const inAppAppDefaultTextHovered = main.findArrayById(dataArr, "57:22647");
  const inAppAppDefaultTextActive = main.findArrayById(dataArr, "57:22668");
  const inAppAppDefaultDot = main.findArrayById(dataArr, "16:3285");
  const inAppAppDefaultArrowIcon = main.findArrayById(dataArr, "16:3287");
  // In App - App -> New Messages
  const inAppAppbadgeText = main.findArrayById(dataArr, "57:22612");
  // In App - App -> New Mention
  const inAppAppNewMentionInner = main.findArrayById(dataArr, "516:36485");
  const inAppAppNewMentionText = main.findArrayById(dataArr, "516:36489");

  // In App - Record -> Default
  const inAppRecordDefault = main.findArrayById(dataArr, "57:22706");
  const inAppRecordDefaultInner = main.findArrayById(dataArr, "57:22707");
  const inAppRecordDefaultInnerActive = main.findArrayById(dataArr, "57:22924");
  const inAppRecordDefaultInnerHovered = main.findArrayById(dataArr, "57:22885");
  const inAppRecordDefaultText = main.findArrayById(dataArr, "57:22711");
  const inAppRecordDefaultTextActive = main.findArrayById(dataArr, "57:22927");
  const inAppRecordDefaultTextHovered = main.findArrayById(dataArr, "57:22927");
  // In App - Record -> New Messages
  const inAppRecordbadgeText = main.findArrayById(dataArr, "57:22906");
  // In App - Record -> New Mention
  const inAppRecordNewMentionText = main.findArrayById(dataArr, "516:36586");
  const inAppRecordNewMentionInner = main.findArrayById(dataArr, "516:36583");

  const inAppRecordDefaultCloseIcon = main.findArrayById(dataArr, "57:22934");

  // Record
  const recordDefault = main.findArrayById(dataArr, "516:36438");
  const recordDefaultInner = main.findArrayById(dataArr, "516:36450");
  const recordDefaultSolutionAppWrapper = main.findArrayById(dataArr, "516:36454");
  const recordDefaultSolutionAppInner = main.findArrayById(dataArr, "516:36455");
  const recordDefaultSolutionAppInnerHover = main.findArrayById(dataArr, "516:36460");
  const recordDefaultSolutionAppInnerActive = main.findArrayById(dataArr, "516:36645");
  const recordDefaultSolutionAppText = main.findArrayById(dataArr, "516:36457");
  const recordDefaultText = main.findArrayById(dataArr, "516:36453");

  // Channel
  const channelDefault = main.findArrayById(dataArr, "519:36862");
  const channelDefaultInner = main.findArrayById(dataArr, "519:36871");
  const channelDefaultInnerHover = main.findArrayById(dataArr, "520:36879");
  const channelDefaultInnerActive = main.findArrayById(dataArr, "520:36887");
  const channelDefaultLabelOuter = main.findArrayById(dataArr, "519:36872");
  const channelDefaultLabelInner = main.findArrayById(dataArr, "519:36873");
  const channelDefaultText = main.findArrayById(dataArr, "519:36875");
  const channelDefaultTextActive = main.findArrayById(dataArr, "520:36891");
  // Channel -> New Messages
  const channelbadgeText = main.findArrayById(dataArr, "520:36910");
  // Channel -> New Mention
  const channelNewMentionText = main.findArrayById(dataArr, "520:36945");
  const channelNewMentionInner = main.findArrayById(dataArr, "520:36941");

  // Member
  const memberDefault = main.findArrayById(dataArr, "521:37001");
  const memberDefaultInner = main.findArrayById(dataArr, "521:37009");
  const memberDefaultInnerHover = main.findArrayById(dataArr, "521:37020");
  const memberDefaultInnerActive = main.findArrayById(dataArr, "521:37029");
  const memberDefaultLabelOuter = main.findArrayById(dataArr, "521:37010");
  const memberDefaultLabelInner = main.findArrayById(dataArr, "521:37011");
  const memberDefaultText = main.findArrayById(dataArr, "521:37016");
  const memberDefaultTextActive = main.findArrayById(dataArr, "521:37036");
  // Member -> New Messages
  const memberbadgeText = main.findArrayById(dataArr, "521:37057");
  // Member -> New Mention
  const memberNewMentionText = main.findArrayById(dataArr, "521:37096");
  const memberNewMentionInner = main.findArrayById(dataArr, "521:37089");



  const DATA = {
    globals: {
      dot: {
        width: _.get(
          inAppAppDefaultDot,
          `absoluteBoundingBox.width`,
          10
        ),
        height: _.get(
          inAppAppDefaultDot,
          `absoluteBoundingBox.height`,
          10
        ),
        borderRadius: _.get(inAppAppDefaultDot, `cornerRadius`, 2),
      },
      arrowIcon: {
        rotation: main.roundToDecimal(
          _.get(inAppAppDefaultArrowIcon, `rotation`, -1.57) *
            (180 / Math.PI),
          2
        ),
        opacity: main.roundToDecimal(
          _.get(inAppAppDefaultArrowIcon, `opacity`, 0.3),
          2
        ),
      },
    },
    types: {
      inAppApp: {
        default: {
          globals: {
            gap: _.get(inAppAppDefault, `itemSpacing`, 10),
            paddingTop: _.get(inAppAppDefault, `paddingTop`, 1),
            paddingRight: _.get(inAppAppDefault, `paddingRight`, 10),
            paddingBottom: _.get(inAppAppDefault, `paddingBottom`, 1),
            paddingLeft: _.get(inAppAppDefault, `paddingLeft`, 10),
          },
          inner: {
            borderRadius: _.get(inAppAppDefaultInner, `cornerRadius`, 6),
            paddingTop: _.get(inAppAppDefaultInner, `paddingTop`, 5),
            paddingRight: _.get(inAppAppDefaultInner, `paddingRight`, 5),
            paddingBottom: _.get(
              inAppAppDefaultInner,
              `paddingBottom`,
              5
            ),
            paddingLeft: _.get(inAppAppDefaultInner, `paddingLeft`, 5),
          },
          labelOuter: {
            gap: _.get(inAppAppDefaultLabelOuter, `itemSpacing`, 6),
          },
          labelInner: {
            gap: _.get(inAppAppDefaultLabelInner, `itemSpacing`, 12),
          },
          text: {
            fontSize: _.get(inAppAppDefaultText, `style.fontSize`, 14),
            fontWeight: _.get(
              inAppAppDefaultText,
              `style.fontWeight`,
              300
            ),
            lineHeight: _.get(
              inAppAppDefaultText,
              `style.lineHeightPx`,
              20
            ),
            color: `rgba(${main.rgbaObj(
              _.get(inAppAppDefaultText, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppAppDefaultText, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppAppDefaultText, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(inAppAppDefaultText, `opacity`, 0.7),
              2
            )})`
          },
          stateHover: {
            text: {
              color: `rgba(${main.rgbaObj(
                _.get(inAppAppDefaultTextHovered, `fills[0].color.r`, 1)
              )}, ${main.rgbaObj(
                _.get(inAppAppDefaultTextHovered, `fills[0].color.g`, 1)
              )}, ${main.rgbaObj(
                _.get(inAppAppDefaultTextHovered, `fills[0].color.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(inAppAppDefaultTextHovered, `fills[0].color.a`, 1),
                2
              )})`
            },
            inner: {
              backgroundColor: `rgba(${main.rgbaObj(
                _.get(inAppAppDefaultInnerHovered, `backgroundColor.r`, 1)
              )}, ${main.rgbaObj(
                _.get(inAppAppDefaultInnerHovered, `backgroundColor.g`, 1)
              )}, ${main.rgbaObj(
                _.get(inAppAppDefaultInnerHovered, `backgroundColor.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(inAppAppDefaultInnerHovered, `backgroundColor.a`, 0.3),
                2
              )})`
            }
          },
          stateActive: {
            text: {
              fontWeight: _.get(inAppAppDefaultTextActive, `style.fontWeight`, 400),
              color: `rgba(${main.rgbaObj(
                _.get(inAppAppDefaultTextActive, `fills[0].color.r`, 1)
              )}, ${main.rgbaObj(
                _.get(inAppAppDefaultTextActive, `fills[0].color.g`, 1)
              )}, ${main.rgbaObj(
                _.get(inAppAppDefaultTextActive, `fills[0].color.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(inAppAppDefaultTextActive, `fills[0].color.a`, 1),
                2
              )})`
            },
          },
        },
        badge: {
          text: {
            fontWeight: _.get(inAppAppbadgeText, `style.fontWeight`, 400),
            color: `rgba(${main.rgbaObj(
              _.get(inAppAppbadgeText, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppAppbadgeText, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppAppbadgeText, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(inAppAppbadgeText, `opacity`, 1),
              2
            )})`
          }
        },
        newMention: {
          text: {
            fontWeight: _.get(inAppAppNewMentionText, `style.fontWeight`, 400),
            color: `rgba(${main.rgbaObj(
              _.get(inAppAppNewMentionText, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppAppNewMentionText, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppAppNewMentionText, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(inAppAppNewMentionText, `opacity`, 1),
              2
            )})`
          },
          inner: {
            backgroundColor: `rgba(${main.rgbaObj(
              _.get(inAppAppNewMentionInner, `backgroundColor.r`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppAppNewMentionInner, `backgroundColor.g`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppAppNewMentionInner, `backgroundColor.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(inAppAppNewMentionInner, `backgroundColor.a`, 0.05),
              2
            )})`
          }
        }
      },
      inAppRecord: {
        default: {
          globals: {
            gap: _.get(inAppRecordDefault, `itemSpacing`, 10),
            paddingTop: _.get(inAppRecordDefault, `paddingTop`, 1),
            paddingRight: _.get(inAppRecordDefault, `paddingRight`, 10),
            paddingBottom: _.get(inAppRecordDefault, `paddingBottom`, 1),
            paddingLeft: _.get(inAppRecordDefault, `paddingLeft`, 29),
          },
          inner: {
            height: _.get(inAppRecordDefaultInner, `absoluteBoundingBox.height`, 28),
            gap: _.get(inAppRecordDefaultInner, `itemSpacing`, 12),
            borderRadius: _.get(inAppRecordDefaultInner, `cornerRadius`, 6),
            paddingTop: _.get(inAppRecordDefaultInner, `paddingTop`, 0),
            paddingRight: _.get(inAppRecordDefaultInner, `paddingRight`, 5),
            paddingBottom: _.get(inAppRecordDefaultInner, `paddingBottom`, 0),
            paddingLeft: _.get(inAppRecordDefaultInner, `paddingLeft`, 8),
          },
          text: {
            fontSize: _.get(inAppRecordDefaultText, `style.fontSize`, 14),
            fontWeight: _.get(
              inAppRecordDefaultText,
              `style.fontWeight`,
              300
            ),
            lineHeight: _.get(
              inAppRecordDefaultText,
              `style.lineHeightPx`,
              20
            ),
            color: `rgba(${main.rgbaObj(
              _.get(inAppRecordDefaultText, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppRecordDefaultText, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppRecordDefaultText, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(inAppRecordDefaultText, `opacity`, 0.7),
              2
            )})`
          },
          stateHover: {
            inner: {
              backgroundColor: `rgba(${main.rgbaObj(
                _.get(inAppRecordDefaultInnerHovered, `backgroundColor.r`, 1)
              )}, ${main.rgbaObj(
                _.get(inAppRecordDefaultInnerHovered, `backgroundColor.g`, 1)
              )}, ${main.rgbaObj(
                _.get(inAppRecordDefaultInnerHovered, `backgroundColor.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(inAppRecordDefaultInnerHovered, `backgroundColor.a`, 0.1),
                2
              )})`,
            },
            text: {
              color: `rgba(${main.rgbaObj(
                _.get(inAppRecordDefaultTextHovered, `fills[0].color.r`, 1)
              )}, ${main.rgbaObj(
                _.get(inAppRecordDefaultTextHovered, `fills[0].color.g`, 1)
              )}, ${main.rgbaObj(
                _.get(inAppRecordDefaultTextHovered, `fills[0].color.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(inAppRecordDefaultTextHovered, `opacity`, 1),
                2
              )})`
            },
            closeIcon: {
              opacity: main.roundToDecimal(_.get(inAppRecordDefaultCloseIcon, `opacity`, 0.4), 2),
              width: _.get(inAppRecordDefaultCloseIcon, `absoluteBoundingBox.width`, 16),
              height: _.get(inAppRecordDefaultCloseIcon, `absoluteBoundingBox.height`, 16),
            },
          },
          stateActive: {
            text: {
              color: `rgba(${main.rgbaObj(
                _.get(inAppRecordDefaultTextActive, `fills[0].color.r`, 1)
              )}, ${main.rgbaObj(
                _.get(inAppRecordDefaultTextActive, `fills[0].color.g`, 1)
              )}, ${main.rgbaObj(
                _.get(inAppRecordDefaultTextActive, `fills[0].color.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(inAppRecordDefaultTextActive, `fills[0].color.a`, 1),
                2
              )})`,
              fontWeight: _.get(inAppRecordDefaultTextActive, `style.fontWeight`, 400)
            },
            inner: {
              backgroundColor: `rgba(${main.rgbaObj(
                _.get(inAppRecordDefaultInnerActive, `backgroundColor.r`, 0.23)
              )}, ${main.rgbaObj(
                _.get(inAppRecordDefaultInnerActive, `backgroundColor.g`, 0.52)
              )}, ${main.rgbaObj(
                _.get(inAppRecordDefaultInnerActive, `backgroundColor.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(inAppRecordDefaultInnerActive, `backgroundColor.a`, 1),
                2
              )})`,
            }
          }
        },
        badge: {
          text: {
            color: `rgba(${main.rgbaObj(
              _.get(inAppRecordbadgeText, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppRecordbadgeText, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppRecordbadgeText, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(inAppRecordbadgeText, `fills[0].color.a`, 1),
              2
            )})`,
            fontWeight: _.get(inAppRecordbadgeText, `style.fontWeight`, 400)
          }
        },
        newMention: {
          text: {
            color: `rgba(${main.rgbaObj(
              _.get(inAppRecordNewMentionText, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppRecordNewMentionText, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppRecordNewMentionText, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(inAppRecordNewMentionText, `fills[0].color.a`, 1),
              2
            )})`,
            fontWeight: _.get(inAppRecordNewMentionText, `style.fontWeight`, 400)
          },
          inner: {
            backgroundColor: `rgba(${main.rgbaObj(
              _.get(inAppRecordNewMentionInner, `backgroundColor.r`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppRecordNewMentionInner, `backgroundColor.g`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppRecordNewMentionInner, `backgroundColor.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(inAppRecordNewMentionInner, `backgroundColor.a`, 0.05),
              2
            )})`,
          },
        }
      },
      record: {
        default: {
          globals: {
            gap: _.get(recordDefault, `itemSpacing`, 10),
            paddingTop: _.get(recordDefault, `paddingTop`, 1),
            paddingRight: _.get(recordDefault, `paddingRight`, 10),
            paddingBottom: _.get(recordDefault, `paddingBottom`, 1),
            paddingLeft: _.get(recordDefault, `paddingLeft`, 10),
          },
          inner: {
            gap: _.get(recordDefaultInner, `itemSpacing`, 3),
            borderRadius: _.get(recordDefaultInner, `cornerRadius`, 6),
            paddingTop: _.get(recordDefaultInner, `paddingTop`, 5),
            paddingRight: _.get(recordDefaultInner, `paddingRight`, 10),
            paddingBottom: _.get(recordDefaultInner, `paddingBottom`, 5),
            paddingLeft: _.get(recordDefaultInner, `paddingLeft`, 10),
          },
          solutionApp: {
            wrapper: {
              gap: _.get(recordDefaultSolutionAppWrapper, `itemSpacing`, 6),
            },
            inner: {
              gap: _.get(recordDefaultSolutionAppInner, `itemSpacing`, 9),
            },
            text: {
              fontSize: _.get(recordDefaultSolutionAppText, `style.fontSize`, 11),
              fontWeight: _.get(
                recordDefaultSolutionAppText,
                `style.fontWeight`,
                300
              ),
              lineHeight: _.get(
                recordDefaultSolutionAppText,
                `style.lineHeightPx`,
                16
              ),
              color: `rgba(${main.rgbaObj(
                _.get(recordDefaultSolutionAppText, `fills[0].color.r`, 1)
              )}, ${main.rgbaObj(
                _.get(recordDefaultSolutionAppText, `fills[0].color.g`, 1)
              )}, ${main.rgbaObj(
                _.get(recordDefaultSolutionAppText, `fills[0].color.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(recordDefaultSolutionAppText, `opacity`, 0.7),
                2
              )})`
            },
          },
          text: {
            fontSize: _.get(recordDefaultText, `style.fontSize`, 14),
            fontWeight: _.get(
              recordDefaultText,
              `style.fontWeight`,
              300
            ),
            lineHeight: _.get(
              recordDefaultText,
              `style.lineHeightPx`,
              22
            ),
            color: `rgba(${main.rgbaObj(
              _.get(recordDefaultText, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(recordDefaultText, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(recordDefaultText, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(recordDefaultText, `opacity`, 1),
              2
            )})`
          },
          stateHover: {
            inner: {
              backgroundColor: `rgba(${main.rgbaObj(
                _.get(recordDefaultSolutionAppInnerHover, `backgroundColor.r`, 1)
              )}, ${main.rgbaObj(
                _.get(recordDefaultSolutionAppInnerHover, `backgroundColor.g`, 1)
              )}, ${main.rgbaObj(
                _.get(recordDefaultSolutionAppInnerHover, `backgroundColor.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(recordDefaultSolutionAppInnerHover, `backgroundColor.a`, 0.1),
                2
              )})`
            }
          },
          stateActive: {
            inner: {
              backgroundColor: `rgba(${main.rgbaObj(
                _.get(recordDefaultSolutionAppInnerActive, `backgroundColor.r`, 0.22)
              )}, ${main.rgbaObj(
                _.get(recordDefaultSolutionAppInnerActive, `backgroundColor.g`, 0.52)
              )}, ${main.rgbaObj(
                _.get(recordDefaultSolutionAppInnerActive, `backgroundColor.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(recordDefaultSolutionAppInnerActive, `backgroundColor.a`, 0.5),
                2
              )})`
            }
          },
        },
        badge: {
          text: {
            fontWeight: _.get(inAppAppbadgeText, `style.fontWeight`, 400),
            color: `rgba(${main.rgbaObj(
              _.get(inAppAppbadgeText, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppAppbadgeText, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppAppbadgeText, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(inAppAppbadgeText, `opacity`, 1),
              2
            )})`
          }
        },
        newMention: {
          text: {
            fontWeight: _.get(inAppAppNewMentionText, `style.fontWeight`, 400),
            color: `rgba(${main.rgbaObj(
              _.get(inAppAppNewMentionText, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppAppNewMentionText, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppAppNewMentionText, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(inAppAppNewMentionText, `opacity`, 1),
              2
            )})`
          },
          inner: {
            backgroundColor: `rgba(${main.rgbaObj(
              _.get(inAppAppNewMentionInner, `backgroundColor.r`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppAppNewMentionInner, `backgroundColor.g`, 1)
            )}, ${main.rgbaObj(
              _.get(inAppAppNewMentionInner, `backgroundColor.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(inAppAppNewMentionInner, `backgroundColor.a`, 0.05),
              2
            )})`
          }
        }
      },
      channel: {
        default: {
          globals: {
            gap: _.get(channelDefault, `itemSpacing`, 10),
            paddingTop: _.get(channelDefault, `paddingTop`, 1),
            paddingRight: _.get(channelDefault, `paddingRight`, 10),
            paddingBottom: _.get(channelDefault, `paddingBottom`, 1),
            paddingLeft: _.get(channelDefault, `paddingLeft`, 10),
          },
          inner: {
            gap: _.get(channelDefaultInner, `itemSpacing`, 3),
            borderRadius: _.get(channelDefaultInner, `cornerRadius`, 6),
            paddingTop: _.get(channelDefaultInner, `paddingTop`, 5),
            paddingRight: _.get(channelDefaultInner, `paddingRight`, 10),
            paddingBottom: _.get(channelDefaultInner, `paddingBottom`, 5),
            paddingLeft: _.get(channelDefaultInner, `paddingLeft`, 10),
          },
          labelOuter: {
            gap: _.get(channelDefaultLabelOuter, `itemSpacing`, 6),
          },
          labelInner: {
            gap: _.get(channelDefaultLabelInner, `itemSpacing`, 12),
          },
          text: {
            fontSize: _.get(channelDefaultText, `style.fontSize`, 14),
            fontWeight: _.get(
              channelDefaultText,
              `style.fontWeight`,
              300
            ),
            lineHeight: _.get(
              channelDefaultText,
              `style.lineHeightPx`,
              22
            ),
            color: `rgba(${main.rgbaObj(
              _.get(channelDefaultText, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(channelDefaultText, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(channelDefaultText, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(channelDefaultText, `opacity`, 1),
              2
            )})`
          },
          stateHover: {
            inner: {
              backgroundColor: `rgba(${main.rgbaObj(
                _.get(channelDefaultInnerHover, `backgroundColor.r`, 1)
              )}, ${main.rgbaObj(
                _.get(channelDefaultInnerHover, `backgroundColor.g`, 1)
              )}, ${main.rgbaObj(
                _.get(channelDefaultInnerHover, `backgroundColor.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(channelDefaultInnerHover, `backgroundColor.a`, 0.1),
                2
              )})`
            }
          },
          stateActive: {
            inner: {
              backgroundColor: `rgba(${main.rgbaObj(
                _.get(channelDefaultInnerActive, `backgroundColor.r`, 0.22)
              )}, ${main.rgbaObj(
                _.get(channelDefaultInnerActive, `backgroundColor.g`, 0.52)
              )}, ${main.rgbaObj(
                _.get(channelDefaultInnerActive, `backgroundColor.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(channelDefaultInnerActive, `backgroundColor.a`, 0.5),
                2
              )})`
            },
            text: {
              color: `rgba(${main.rgbaObj(
                _.get(channelDefaultTextActive, `fills[0].color.r`, 1)
              )}, ${main.rgbaObj(
                _.get(channelDefaultTextActive, `fills[0].color.g`, 1)
              )}, ${main.rgbaObj(
                _.get(channelDefaultTextActive, `fills[0].color.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(channelDefaultTextActive, `fills[0].color.a`, 1),
                2
              )})`,
              fontWeight: _.get(channelDefaultTextActive, `style.fontWeight`, 400)
            },
          },
        },
        badge: {
          text: {
            fontWeight: _.get(channelbadgeText, `style.fontWeight`, 400),
            color: `rgba(${main.rgbaObj(
              _.get(channelbadgeText, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(channelbadgeText, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(channelbadgeText, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(channelbadgeText, `opacity`, 1),
              2
            )})`
          }
        },
        newMention: {
          text: {
            fontWeight: _.get(channelNewMentionText, `style.fontWeight`, 400),
            color: `rgba(${main.rgbaObj(
              _.get(channelNewMentionText, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(channelNewMentionText, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(channelNewMentionText, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(channelNewMentionText, `opacity`, 1),
              2
            )})`
          },
          inner: {
            backgroundColor: `rgba(${main.rgbaObj(
              _.get(channelNewMentionInner, `backgroundColor.r`, 1)
            )}, ${main.rgbaObj(
              _.get(channelNewMentionInner, `backgroundColor.g`, 1)
            )}, ${main.rgbaObj(
              _.get(channelNewMentionInner, `backgroundColor.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(channelNewMentionInner, `backgroundColor.a`, 0.05),
              2
            )})`
          }
        }
      },
      member: {
        default: {
          globals: {
            gap: _.get(memberDefault, `itemSpacing`, 10),
            paddingTop: _.get(memberDefault, `paddingTop`, 1),
            paddingRight: _.get(memberDefault, `paddingRight`, 10),
            paddingBottom: _.get(memberDefault, `paddingBottom`, 1),
            paddingLeft: _.get(memberDefault, `paddingLeft`, 10),
          },
          inner: {
            gap: _.get(memberDefaultInner, `itemSpacing`, 3),
            borderRadius: _.get(memberDefaultInner, `cornerRadius`, 6),
            paddingTop: _.get(memberDefaultInner, `paddingTop`, 5),
            paddingRight: _.get(memberDefaultInner, `paddingRight`, 10),
            paddingBottom: _.get(memberDefaultInner, `paddingBottom`, 5),
            paddingLeft: _.get(memberDefaultInner, `paddingLeft`, 10),
          },
          labelOuter: {
            gap: _.get(memberDefaultLabelOuter, `itemSpacing`, 6),
          },
          labelInner: {
            gap: _.get(memberDefaultLabelInner, `itemSpacing`, 12),
          },
          text: {
            fontSize: _.get(memberDefaultText, `style.fontSize`, 14),
            fontWeight: _.get(
              memberDefaultText,
              `style.fontWeight`,
              300
            ),
            lineHeight: _.get(
              memberDefaultText,
              `style.lineHeightPx`,
              22
            ),
            color: `rgba(${main.rgbaObj(
              _.get(memberDefaultText, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(memberDefaultText, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(memberDefaultText, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(memberDefaultText, `opacity`, 1),
              2
            )})`
          },
          stateHover: {
            inner: {
              backgroundColor: `rgba(${main.rgbaObj(
                _.get(memberDefaultInnerHover, `backgroundColor.r`, 1)
              )}, ${main.rgbaObj(
                _.get(memberDefaultInnerHover, `backgroundColor.g`, 1)
              )}, ${main.rgbaObj(
                _.get(memberDefaultInnerHover, `backgroundColor.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(memberDefaultInnerHover, `backgroundColor.a`, 0.1),
                2
              )})`
            }
          },
          stateActive: {
            inner: {
              backgroundColor: `rgba(${main.rgbaObj(
                _.get(memberDefaultInnerActive, `backgroundColor.r`, 0.22)
              )}, ${main.rgbaObj(
                _.get(memberDefaultInnerActive, `backgroundColor.g`, 0.52)
              )}, ${main.rgbaObj(
                _.get(memberDefaultInnerActive, `backgroundColor.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(memberDefaultInnerActive, `backgroundColor.a`, 0.5),
                2
              )})`
            },
            text: {
              color: `rgba(${main.rgbaObj(
                _.get(memberDefaultTextActive, `fills[0].color.r`, 1)
              )}, ${main.rgbaObj(
                _.get(memberDefaultTextActive, `fills[0].color.g`, 1)
              )}, ${main.rgbaObj(
                _.get(memberDefaultTextActive, `fills[0].color.b`, 1)
              )}, ${main.roundToDecimal(
                _.get(memberDefaultTextActive, `fills[0].color.a`, 1),
                2
              )})`,
              fontWeight: _.get(memberDefaultTextActive, `style.fontWeight`, 400)
            },
          },
        },
        badge: {
          text: {
            fontWeight: _.get(memberbadgeText, `style.fontWeight`, 400),
            color: `rgba(${main.rgbaObj(
              _.get(memberbadgeText, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(memberbadgeText, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(memberbadgeText, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(memberbadgeText, `opacity`, 1),
              2
            )})`
          }
        },
        newMention: {
          text: {
            fontWeight: _.get(memberNewMentionText, `style.fontWeight`, 400),
            color: `rgba(${main.rgbaObj(
              _.get(memberNewMentionText, `fills[0].color.r`, 1)
            )}, ${main.rgbaObj(
              _.get(memberNewMentionText, `fills[0].color.g`, 1)
            )}, ${main.rgbaObj(
              _.get(memberNewMentionText, `fills[0].color.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(memberNewMentionText, `opacity`, 1),
              2
            )})`
          },
          inner: {
            backgroundColor: `rgba(${main.rgbaObj(
              _.get(memberNewMentionInner, `backgroundColor.r`, 1)
            )}, ${main.rgbaObj(
              _.get(memberNewMentionInner, `backgroundColor.g`, 1)
            )}, ${main.rgbaObj(
              _.get(memberNewMentionInner, `backgroundColor.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(memberNewMentionInner, `backgroundColor.a`, 0.05),
              2
            )})`
          }
        }
      }
    }
  };

  Object.assign(subSidebarRowData, DATA);
  return subSidebarRowData;
};

exports.getSubSidebarRowData = getSubSidebarRowData;