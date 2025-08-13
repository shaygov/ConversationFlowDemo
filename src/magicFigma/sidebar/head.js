const main = require("../../../magic");
const _ = require("lodash");

const getHeaderData = (dataArr) => {
  const header = {};

  const wrapper_bg = main.findArrayById(dataArr, "16:2810");
  const arrows = main.findArrayById(dataArr, "16:2822");
  const searchWrapper = main.findArrayById(dataArr, "777:19609");
  const searchBg = main.findArrayById(dataArr, "777:18388");
  const searchInner = main.findArrayById(dataArr, "777:18389");
  const searchIcon = main.findArrayById(dataArr, "777:18390");
  const searchText = main.findArrayById(dataArr, "777:18391");
  const userWrapper = main.findArrayById(dataArr, "16:2812");
  const userInner = main.findArrayById(dataArr, "16:2813");
  const userIcon = main.findArrayById(dataArr, "16:2815");

  const DATA = {
    wrapper: {
      backgroundColor: `rgba(${main.rgbaObj(
        _.get(wrapper_bg, `fills[0].color.r`, 0)
      )}, ${main.rgbaObj(
        _.get(wrapper_bg, `fills[0].color.g`, 0)
      )}, ${main.rgbaObj(
        _.get(wrapper_bg, `fills[0].color.b`, 0)
      )}, ${main.roundToDecimal(
        _.get(wrapper_bg, `fills[0].opacity`, 0.1),
        2
      )})`
    },
    arrowsOpacity: _.get(arrows, `opacity`, 0.5),
    search: {
      borderRadius: _.get(searchBg, `cornerRadius`, 8),
      backgroundColor: `rgba(${main.rgbaObj(
        _.get(searchBg, `fills[0].color.r`, 1)
      )}, ${main.rgbaObj(
        _.get(searchBg, `fills[0].color.g`, 1)
      )}, ${main.rgbaObj(
        _.get(searchBg, `fills[0].color.b`, 1)
      )}, ${main.roundToDecimal(
        _.get(searchBg, `opacity`, 0.05),
        2
      )})`,
      wrapper: {
        gap: _.get(searchWrapper, `itemSpacing`, 11)
      },
      inner: {
        gap: _.get(searchInner, `itemSpacing`, 11)
      },
      icon: {
        opacity: main.roundToDecimal(_.get(searchIcon, `opacity`, 0.5), 2),
      },
      text: {
        color: `rgba(${main.rgbaObj(
          _.get(searchText, `fills[0].color.r`, 1)
        )}, ${main.rgbaObj(
          _.get(searchText, `fills[0].color.g`, 1)
        )}, ${main.rgbaObj(
          _.get(searchText, `fills[0].color.b`, 1)
        )}, ${main.roundToDecimal(
          _.get(searchText, `opacity`, 0.4),
          2
        )})`
      }
    },
    user: {
      wrapper: {
        gap: _.get(userWrapper, `itemSpacing`, 16)
      },
      inner: {
        gap: _.get(userInner, `itemSpacing`, 4)
      },
      icon: {
        opacity: main.roundToDecimal(_.get(userIcon, `opacity`, 0.45), 2),
      }
    }
  };

  Object.assign(header, DATA);

  return header;
};

exports.getHeaderData = getHeaderData;