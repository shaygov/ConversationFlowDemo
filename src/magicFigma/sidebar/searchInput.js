const main = require("../../../magic");
const _ = require("lodash");

const getSearchInputData = (dataArr) => {
  const searchInputData = {};
  const search_container = main.findArrayById(dataArr, "516:35188");
  const search_globals = main.findArrayById(dataArr, "524:9409");
  const search_globals_inner = main.findArrayById(dataArr, "524:9399");
  const search_globals_text = main.findArrayById(dataArr, "524:9400");
  const search_globals_right_controls = main.findArrayById(dataArr, "530:11123");
  const search_globals_right_controls_tree = main.findArrayById(dataArr, "530:11125");
  const search_globals_right_controls_tree_icon = main.findArrayById(dataArr, "530:11126");
  const search_globals_right_controls_filter = main.findArrayById(dataArr, "530:11128");

  // Hover
  const hover_search_globals = main.findArrayById(dataArr, "524:9706");
  const hover_search_globals_text = main.findArrayById(dataArr, "524:9708");
  const hover_search_globals_right_controls_tree = main.findArrayById(dataArr, "530:11102");
  const hover_search_globals_right_controls_filter = main.findArrayById(dataArr, "530:11617");
  const hover_search_globals_right_controls_tree_icon = main.findArrayById(dataArr, "530:11103");
  
  // Active
  const active_search_globals_right_controls_tree = main.findArrayById(dataArr, "530:11642");
  const active_search_globals_right_controls_filter = main.findArrayById(dataArr, "530:11671");
  
  // Typing 
  const typing_search_globals_right_controls_tree = main.findArrayById(dataArr, "524:9739");


  const DATA = {
    globals: {
      paddingTop: _.get(search_globals, `paddingTop`, 3),
      paddingRight: _.get(search_globals, `paddingRight`, 10),
      paddingBottom: _.get(search_globals, `paddingBottom`, 3),
      paddingLeft: _.get(search_globals, `paddingLeft`, 10),
      gap: _.get(search_globals, `itemSpacing`, 10),
      cornerRadius: _.get(search_globals, `cornerRadius`, 6),
      backgroundColor: `rgba(${main.rgbaObj(
        _.get(search_globals, `backgroundColor.r`, 1)
      )}, ${main.rgbaObj(
        _.get(search_globals, `backgroundColor.g`, 1)
      )}, ${main.rgbaObj(
        _.get(search_globals, `backgroundColor.b`, 1)
      )}, ${main.roundToDecimal(
        _.get(search_globals, `backgroundColor.a`, 0.03),
        2
      )})`,
      searchContainer: {
        paddingTop: _.get(search_container, `paddingTop`, 0),
        paddingRight: _.get(search_container, `paddingRight`, 10),
        paddingBottom: _.get(search_container, `paddingBottom`, 10),
        paddingLeft: _.get(search_container, `paddingLeft`, 10),
        gap: _.get(search_container, `itemSpacing`, 10),
      },
      inner: {
        paddingTop: _.get(search_globals_inner, `paddingTop`, 4),
        paddingRight: _.get(search_globals_inner, `paddingRight`, 0),
        paddingBottom: _.get(search_globals_inner, `paddingBottom`, 4),
        paddingLeft: _.get(search_globals_inner, `paddingLeft`, 0),
        gap: _.get(search_globals_inner, `itemSpacing`, 11),
      },
      text: {
        fontSize: _.get(search_globals_text, `style.fontSize`, 13),
        fontWeight: _.get(search_globals_text, `style.fontWeight`, 400),
        lineHeight: _.get(search_globals_text, `style.lineHeightPx`, 20),
        color: `rgba(${main.rgbaObj(
          _.get(search_globals_text, `fills[0].color.r`, 1)
        )}, ${main.rgbaObj(
          _.get(search_globals_text, `fills[0].color.g`, 1)
        )}, ${main.rgbaObj(
          _.get(search_globals_text, `fills[0].color.b`, 1)
        )}, ${main.roundToDecimal(
          _.get(search_globals_text, `opacity`, 0.3),
          2
        )})`
      },
      rightControls: {
        gap: _.get(search_globals_right_controls, `itemSpacing`, 7),
        tree: {
          width: _.get(search_globals_right_controls_tree, `absoluteBoundingBox.width`, 20),
          height: _.get(search_globals_right_controls_tree, `absoluteBoundingBox.height`, 20),
          paddingTop: _.get(search_globals_right_controls_tree, `paddingTop`, 2),
          paddingRight: _.get(search_globals_right_controls_tree, `paddingRight`, 2),
          paddingBottom: _.get(search_globals_right_controls_tree, `paddingBottom`, 2),
          paddingLeft: _.get(search_globals_right_controls_tree, `paddingLeft`, 2),
          gap: _.get(search_globals_right_controls_tree, `itemSpacing`, 10),
          cornerRadius: _.get(search_globals_right_controls_tree, `cornerRadius`, 2),
          icon: {
            opacity: main.roundToDecimal(
              _.get(search_globals_right_controls_tree_icon, `opacity`, 0.4),
              2
            )
          }
        },
        filter: {
          width: _.get(search_globals_right_controls_filter, `absoluteBoundingBox.width`, 20),
          height: _.get(search_globals_right_controls_filter, `absoluteBoundingBox.height`, 20),
          paddingTop: _.get(search_globals_right_controls_filter, `paddingTop`, 2),
          paddingRight: _.get(search_globals_right_controls_filter, `paddingRight`, 2),
          paddingBottom: _.get(search_globals_right_controls_filter, `paddingBottom`, 2),
          paddingLeft: _.get(search_globals_right_controls_filter, `paddingLeft`, 2),
          gap: _.get(search_globals_right_controls_filter, `itemSpacing`, 10),
          cornerRadius: _.get(search_globals_right_controls_filter, `cornerRadius`, 2)
        },
        stateHover: {
          tree: {
            backgroundColor: `rgba(${main.rgbaObj(
              _.get(hover_search_globals_right_controls_tree, `backgroundColor.r`, 1)
            )}, ${main.rgbaObj(
              _.get(hover_search_globals_right_controls_tree, `backgroundColor.g`, 1)
            )}, ${main.rgbaObj(
              _.get(hover_search_globals_right_controls_tree, `backgroundColor.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(hover_search_globals_right_controls_tree, `backgroundColor.a`, 0.2),
              2
            )})`,
            icon: {
              opacity: main.roundToDecimal(
                _.get(hover_search_globals_right_controls_tree_icon, `opacity`, 0.8),
                2
              )
            }
          },
          filter: {
            backgroundColor: `rgba(${main.rgbaObj(
              _.get(hover_search_globals_right_controls_filter, `backgroundColor.r`, 1)
            )}, ${main.rgbaObj(
              _.get(hover_search_globals_right_controls_filter, `backgroundColor.g`, 1)
            )}, ${main.rgbaObj(
              _.get(hover_search_globals_right_controls_filter, `backgroundColor.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(hover_search_globals_right_controls_filter, `backgroundColor.a`, 0.2),
              2
            )})`,
          }
        },
        stateActive: {
          tree: {
            backgroundColor: `rgba(${main.rgbaObj(
              _.get(active_search_globals_right_controls_tree, `backgroundColor.r`, 1)
            )}, ${main.rgbaObj(
              _.get(active_search_globals_right_controls_tree, `backgroundColor.g`, 1)
            )}, ${main.rgbaObj(
              _.get(active_search_globals_right_controls_tree, `backgroundColor.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(active_search_globals_right_controls_tree, `backgroundColor.a`, 0.2),
              2
            )})`,
          },
          filter: {
            backgroundColor: `rgba(${main.rgbaObj(
              _.get(active_search_globals_right_controls_filter, `backgroundColor.r`, 1)
            )}, ${main.rgbaObj(
              _.get(active_search_globals_right_controls_filter, `backgroundColor.g`, 1)
            )}, ${main.rgbaObj(
              _.get(active_search_globals_right_controls_filter, `backgroundColor.b`, 1)
            )}, ${main.roundToDecimal(
              _.get(active_search_globals_right_controls_filter, `backgroundColor.a`, 0.2),
              2
            )})`,
          }
        }
      }
    },
    hover: {
      backgroundColor: `rgba(${main.rgbaObj(
        _.get(hover_search_globals, `backgroundColor.r`, 1)
      )}, ${main.rgbaObj(
        _.get(hover_search_globals, `backgroundColor.g`, 1)
      )}, ${main.rgbaObj(
        _.get(hover_search_globals, `backgroundColor.b`, 1)
      )}, ${main.roundToDecimal(
        _.get(hover_search_globals, `backgroundColor.a`, 0.07),
        2
      )})`,
      text: {
        color: `rgba(${main.rgbaObj(
          _.get(hover_search_globals_text, `fills[0].color.r`, 1)
        )}, ${main.rgbaObj(
          _.get(hover_search_globals_text, `fills[0].color.g`, 1)
        )}, ${main.rgbaObj(
          _.get(hover_search_globals_text, `fills[0].color.b`, 1)
        )}, ${main.roundToDecimal(
          _.get(hover_search_globals_text, `opacity`, 0.5),
          2
        )})`
      }
    },
    typing: {
      borderWidth: _.get(typing_search_globals_right_controls_tree, `strokeWeight`, 1),
      borderType: _.get(typing_search_globals_right_controls_tree, `strokes[0].type`, "solid"),
      borderColor: `rgba(${main.rgbaObj(
        _.get(typing_search_globals_right_controls_tree, `strokes[0].color.r`, 0)
      )}, ${main.rgbaObj(
        _.get(typing_search_globals_right_controls_tree, `strokes[0].color.g`, 0)
      )}, ${main.rgbaObj(
        _.get(typing_search_globals_right_controls_tree, `strokes[0].color.b`, 0)
      )}, ${main.roundToDecimal(
        _.get(typing_search_globals_right_controls_tree, `strokes[0].opacity`, 0.05),
        2
      )})`,
    }
  };

  Object.assign(searchInputData, DATA);
  
  return searchInputData;
};

exports.getSearchInputData = getSearchInputData;