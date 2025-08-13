const main = require("../../../magic");
const _ = require("lodash");

const getSidebarData = (dataArr) => {
  const sidebarData = {};

  const SIDEBAR = main.findArrayById(dataArr, "16:3074");

  const DATA = {
    paddingTop: _.get(SIDEBAR, `paddingTop`, 10),
    paddingRight: _.get(SIDEBAR, `paddingRight`, 0),
    paddingBottom: _.get(SIDEBAR, `paddingBottom`, 0),
    paddingLeft: _.get(SIDEBAR, `paddingLeft`, 0),
    borderType: _.get(SIDEBAR, `strokes[0].type`, "solid"),
    individualStrokeWeights: {
      top: _.get(SIDEBAR, `individualStrokeWeights.top`, 0),
      right: _.get(SIDEBAR, `individualStrokeWeights.right`, 0),
      bottom: _.get(SIDEBAR, `individualStrokeWeights.bottom`, 0),
      left: _.get(SIDEBAR, `individualStrokeWeights.top`, 0),
    },
    borderColor: `rgba(${main.rgbaObj(
      _.get(SIDEBAR, `strokes[0].color.r`, 0)
    )}, ${main.rgbaObj(_.get(SIDEBAR, `strokes[0].color.g`, 0))}, ${main.rgbaObj(
      _.get(SIDEBAR, `strokes[0].color.b`, 0)
    )}, ${main.roundToDecimal(_.get(SIDEBAR, `strokes[0].opacity`, 1), 2)})`,
  };

  Object.assign(sidebarData, DATA);

  return sidebarData;
};

exports.getSidebarData = getSidebarData;