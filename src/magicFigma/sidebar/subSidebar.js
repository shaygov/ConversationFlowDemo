const main = require("../../../magic");
const _ = require("lodash");

const getSubSidebarData = (dataArr) => {
  const subSidebarData = {};

  const SUB_SIDEBAR = main.findArrayById(dataArr, "16:3377");

  const DATA = {
    paddingTop: _.get(SUB_SIDEBAR, `paddingTop`, 10),
    paddingRight: _.get(SUB_SIDEBAR, `paddingRight`, 0),
    paddingBottom: _.get(SUB_SIDEBAR, `paddingBottom`, 0),
    paddingLeft: _.get(SUB_SIDEBAR, `paddingLeft`, 0),
    borderType: _.get(SUB_SIDEBAR, `strokes[0].type`, 'solid'),
    individualStrokeWeights: {
      top: _.get(SUB_SIDEBAR, `individualStrokeWeights.top`, 0),
      right: _.get(SUB_SIDEBAR, `individualStrokeWeights.right`, 0),
      bottom: _.get(SUB_SIDEBAR, `individualStrokeWeights.bottom`, 0),
      left: _.get(SUB_SIDEBAR, `individualStrokeWeights.top`, 0)
    },
    borderColor: `rgba(${main.rgbaObj(
      _.get(SUB_SIDEBAR, `strokes[0].color.r`, 0)
    )}, ${main.rgbaObj(
      _.get(SUB_SIDEBAR, `strokes[0].color.g`, 0)
    )}, ${main.rgbaObj(
      _.get(SUB_SIDEBAR, `strokes[0].color.b`, 0)
    )}, ${main.roundToDecimal(
      _.get(SUB_SIDEBAR, `strokes[0].opacity`, 1),
      2
    )})`
  };

  Object.assign(subSidebarData, DATA);
  return subSidebarData;
};

exports.getSubSidebarData = getSubSidebarData;