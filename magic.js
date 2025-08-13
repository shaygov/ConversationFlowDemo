const fs = require("fs");
const request = require("request");
const axios = require("axios");
const _ = require("lodash");

const { getSearchInputData } = require('./src/magicFigma/sidebar/searchInput');
const { getSidebarData } = require('./src/magicFigma/sidebar/sidebar');
const { getSubSidebarRowData } = require('./src/magicFigma/sidebar/subSidebarRow');
const { getSidebarRowData } = require('./src/magicFigma/sidebar/sidebarRow');
const { getNotificationData } = require('./src/magicFigma/badgeNotification');
const { getSubSidebarData } = require('./src/magicFigma/sidebar/subSidebar');
const { getAvatarData } = require('./src/magicFigma/avatar');
const { getHeaderData } = require('./src/magicFigma/sidebar/head');
const { getChatBubbleMenu } = require('./src/magicFigma/chatArea/chatBubbleMenu');
const { getChatBubbleThread } = require('./src/magicFigma/chatArea/chatBubbleThread');
const { getChatBubble } = require('./src/magicFigma/chatArea/chatBubble');
const { getChatInput } = require('./src/magicFigma/chatArea/chatInput');
const { getTimestamp } = require('./src/magicFigma/timestamp');

function downloadData(content, fileName, contentType, folderPath) {
  fs.writeFile(`${folderPath}/${fileName}`, content, (err) => {
    if (err) throw err;
    console.log(`Data written to file - ${fileName}`);

    fs.readdir(folderPath, (err, files) => {
      files.forEach((file) => {
        console.log(file);
      });
    });
  });
}

async function getStylesArtboard(figmaApiKey, figmaId) {
  let result;

  try {
    const response = await axios.get(
      `https://api.figma.com/v1/files/${figmaId}`,
      {
        headers: {
          "X-Figma-Token": figmaApiKey,
        },
      }
    );

    result = response.data;
  } catch (error) {
    console.error(error);
  }

  const baseTokeensJSON = {
    token: {
      grids: {},
      spacers: {},
      colors: {},
      components: {
        SIDEBAR: {},
        SIDEBAR_ROW: {},
        SUB_SIDEBAR: {},
        SUB_SIDEBAR_ROW: {},
        NOTIFICATION: {},
        SEARCH_INPUT: {},
        AVATAR: {},
        HEADER: {}
      },
      chat_area: {
        BUBBLE_MENU: {},
        BUBBLE_THREAD: {},
        BUBBLE: {},
        TIMESTAMP: {},
        CHAT_INPUT: {}
      },
      fonts: {},
      base_colors: {},
      semantic_colors: {},
    },
  };
  let fillsArr = [];

  const figmaTreeStructure = result;
  const components = findArrayById(figmaTreeStructure.document.children, "16:2808");
  const chatArea = findArrayById(figmaTreeStructure.document.children, "542:8641");
  const docChildrens = components.children;
  const chatAreaChildrens = chatArea.children;
  const COLORS = findArrayById(docChildrens, "341:3891");
  const FONTS = findArrayById(docChildrens, "530:11712");
  const stylesVars = figmaTreeStructure.styles;

  const getChildrens = (data) => {
    for (let index = 0; index < data.length; index++) {
      if (data[index].children) {
        getChildrens(data[index].children);
      }
      if (data[index].styles && data[index].fills) {
        fillsArr.push(data[index]);
      }
    }
  };

  getChildrens(docChildrens);

  Object.assign(
    baseTokeensJSON.token.semantic_colors,
    getColorsPalette(COLORS.children, stylesVars)
  );
  Object.assign(
    baseTokeensJSON.token.fonts,
    getFontStyles(FONTS.children, stylesVars)
  );
  Object.assign(
    baseTokeensJSON.token.components.SIDEBAR_ROW,
    getSidebarRowData(docChildrens)
  );
  Object.assign(
    baseTokeensJSON.token.components.NOTIFICATION,
    getNotificationData(docChildrens)
  );
  Object.assign(
    baseTokeensJSON.token.components.AVATAR,
    getAvatarData(docChildrens)
  );
  Object.assign(
    baseTokeensJSON.token.components.SIDEBAR,
    getSidebarData(docChildrens)
  );
  Object.assign(
    baseTokeensJSON.token.components.SUB_SIDEBAR_ROW,
    getSubSidebarRowData(docChildrens)
  );
  Object.assign(
    baseTokeensJSON.token.components.SUB_SIDEBAR,
    getSubSidebarData(docChildrens)
  );
  Object.assign(
    baseTokeensJSON.token.components.HEADER,
    getHeaderData(docChildrens)
  );
  Object.assign(
    baseTokeensJSON.token.chat_area.BUBBLE_MENU,
    getChatBubbleMenu(chatAreaChildrens)
  );
  Object.assign(
    baseTokeensJSON.token.chat_area.BUBBLE_THREAD,
    getChatBubbleThread(chatAreaChildrens)
  );
  Object.assign(
    baseTokeensJSON.token.chat_area.BUBBLE,
    getChatBubble(chatAreaChildrens)
  );
  Object.assign(
    baseTokeensJSON.token.chat_area.TIMESTAMP,
    getTimestamp(chatAreaChildrens)
  );
  Object.assign(
    baseTokeensJSON.token.chat_area.CHAT_INPUT,
    getChatInput(chatAreaChildrens)
  );
  Object.assign(
    baseTokeensJSON.token.components.SEARCH_INPUT,
    getSearchInputData(docChildrens)
  );

  downloadData(
    JSON.stringify(baseTokeensJSON, null, 4),
    "base.json",
    "application/json",
    "./src/figmaUtils"
  );
  getIcons(figmaId, figmaApiKey);
}

// Round to decimal number
const roundToDecimal = (number, decimalPlaces) => {
  const factor = Math.pow(10, decimalPlaces);
  return parseFloat(
    (Math.round(number * factor) / factor).toFixed(decimalPlaces)
  );
};

// Find deep nested element by ID
const findArrayById = (array, id) => {
  if (_.isArray(array)) {
    for (const item of array) {
      if (item.id === id) {
        return item;
      }
      const foundArray = findArrayById(item.children, id);
      if (foundArray) {
        return foundArray;
      }
    }
  }
  return null;
};

// Transform to rgb/rgba
const rgbaObj = (item) => {
  return item * 255;
};

// ======== getColorsPalette ======
const getColorsPalette = (fillsArr, stylesVars) => {
  const paletteColors = {};

  function rgbToHex(r, g, b) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  }

  for (let index = 0; index < fillsArr.length; index++) {
    let item = fillsArr[index];
    let itemk = fillsArr[index].styles.fill || fillsArr[index].styles.fills;
    if (item.fills.length && stylesVars[itemk]) {
      let nameItem = stylesVars[itemk].name
        .replace(/\s/g, "_")
        .replace(/\./g, "_")
        .replace(/\//g, "");
      const r = Math.round(item.fills[0].color.r * 255);
      const g = Math.round(item.fills[0].color.g * 255);
      const b = Math.round(item.fills[0].color.b * 255);
      const hexColor = rgbToHex(r, g, b);

      const colorObj = {
        [nameItem]: {
          value: hexColor,
          alpha: `${item.fills[0].color.a}`,
          type: "color",
        },
      };
      Object.assign(paletteColors, colorObj);
    }
  }

  return paletteColors;
};

// =========== downloadIcon =======
const downloadIcon = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on("close", callback);
  });
};

const extractIconName = (iconString) => {
  // Split the string into parts using the "/" delimiter
  const parts = iconString.split("/");

  // We extract the last part that contains the name of the icon
  const iconName = parts[parts.length - 1].trim();

  // Replace spaces with dashes ("-")
  const replacedSpaces = iconName.replace(/\s/g, "-");

  // Replace "---" with dashes ("-")
  const replacedHyphens = replacedSpaces.replace(/-+/g, "-");

  // Strip all characters that are not letters, numbers, or underscores (_)
  const cleanedIconName = replacedHyphens.replace(/[^\w-]/g, "");

  return cleanedIconName;
};

async function getIcons(fileId, figmaToken) {
  let result;
  let getAllIcons;

  try {
    getAllIcons = await axios.get(`https://api.figma.com/v1/files/${fileId}`, {
      headers: {
        "X-Figma-Token": figmaToken,
      },
    });
  } catch (error) {
    console.error(error);
    return;
  }

  const resultIconsData = getAllIcons.data;
  const docChildrens = resultIconsData.document.children;

  let iconsData = findArrayById(docChildrens, "159:3885");
  // console.log('iconsData: ', iconsData);
  // console.log('ByID: ', );

  iconsData = iconsData
    ? iconsData.children.map((itm) => {
        return { name: itm.name, id: itm.id };
      })
    : [];

  const iconSizes = [
    { size: "S", folder: "Icon-S", name: "S-Icon-S" },
    { size: "M", folder: "Icon-M", name: "S-Icon-M" },
    {
      size: "FontAwesome",
      folder: "Icon-FontAwesome",
      name: "S-Icon - FontAwsome",
    },
  ];

  for (const sizeData of iconSizes) {
    const iconsDataSize = _.filter(iconsData, (itm) =>
      _.includes(itm.name, sizeData.name)
    );
    const ids = iconsDataSize.map((itm) => itm.id).join(",");

    try {
      result = await axios.get(
        `https://api.figma.com/v1/images/${fileId}?ids=${ids}&format=svg`,
        {
          headers: {
            "X-Figma-Token": figmaToken,
          },
        }
      );
    } catch (error) {
      console.error("Error executing the request:", error);
      continue;
    }

    const iconsJson = result.data;
    const imagesUrls = iconsJson.images;
    const iconsImages = Object.keys(imagesUrls);

    let downloadedCount = 0;
    for (let index = 0; index < iconsImages.length; index++) {
      let iconUrl = imagesUrls[iconsImages[index]];
      let iconNameToLowerCase = extractIconName(
        iconsDataSize[index].name
      ).toLowerCase();
      let iconName = iconNameToLowerCase;
      const path = `./src/images/icons/${sizeData.folder}/${iconName}.svg`;
      downloadIcon(iconUrl, path, () => {
        downloadedCount++;
        if (downloadedCount === iconsImages.length) {
          console.log("✅ Done!");
        }
      });
    }
  }
}

// ======= getFontStyles ==========
const getFontStyles = (fillsArr, stylesVars) => {
  const fontStyles = {};
  for (let index = 0; index < fillsArr.length; index++) {
    let subFontItem = fillsArr[index].children;
    for (let i = 0; i < subFontItem.length; i++) {
      let itemk = subFontItem[i].styles.text;
      if (itemk && stylesVars[itemk]) {
        // let nameItem = stylesVars[itemk].name
        //   .replace(/\s/g, "_")
        //   .replace(/\./g, "_")
        //   .replace(/\//g, "")
        //   .replace(/\-/g, "_");
        let nameItem = stylesVars[itemk].name
          .replace(/\s*-\s*/g, "_")
          .replace(/\//g, "-");
        let subFontObj = {
          [nameItem]: {
            family: {
              value: `${subFontItem[i].style.fontFamily}`
            },
            size: {
              value: `${subFontItem[i].style.fontSize}px`
            },
            weight: {
              value: subFontItem[i].style.fontWeight
            },
            lineheight: {
              value: `${subFontItem[i].style.lineHeightPx}px`
            },
            spacing: {
              value:
                subFontItem[i].style.letterSpacing !== 0
                  ? `${subFontItem[i].style.letterSpacing}px`
                  : "normal"
            },
          },
        };
        Object.assign(fontStyles, subFontObj);
      }
    }
  }
  return fontStyles;
};

const changeDesign = () => {
  return getStylesArtboard(
    "figmaApiKey",
    "figmaId" 
  );
};

// exports.solutionsData = solutionsData;
// exports.appsData = appsData;
exports.changeDesign = changeDesign;
exports.findArrayById = findArrayById;
exports.roundToDecimal = roundToDecimal;
exports.rgbaObj = rgbaObj;