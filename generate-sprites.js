const fs = require("fs");
const path = require("path");
const { minify } = require("html-minifier");
const cheerio = require("cheerio");

const iconsDir = path.join(__dirname, "src", "images", "icons");
const spritesDir = path.join(__dirname, "src", "images", "sprites");

fs.readdir(iconsDir, (err, folders) => {
  if (err) {
    console.error("Error reading icons directory:", err);
    return;
  }

  folders.forEach((folder) => {
    const folderPath = path.join(iconsDir, folder);
    const spriteFile = `sprite.${folder}.svg`;

    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error(`Error reading folder '${folder}':`, err);
        return;
      }

      const svgFiles = files.filter((file) => file.endsWith(".svg"));

      if (svgFiles.length === 0) {
        console.warn(
          `No SVG files found in folder '${folder}'. Skipping sprite generation.`
        );
        return;
      }

      const symbols = svgFiles.map((file) => {
        const filePath = path.join(folderPath, file);
        const iconName = path.parse(file).name;
        const svgContent = fs.readFileSync(filePath, "utf8");

        const $ = cheerio.load(svgContent, { xmlMode: true });

        // Remove attr "fill":
        const $path = $("path");
        $path.removeAttr("fill");
        const pathContent = $path.toString();

        // const pathContent = $("path").toString();

        let viewBox = "0 0 16 16";
        switch (folder) {
          case "Icon-S":
            viewBox = "0 0 16 16";
            break;
          case "Icon-M":
            viewBox = "0 0 16 16";
            break;
          case "Icon-FontAwesome":
            viewBox = "0 0 20 20";
            break;
        }

        return `<symbol id="${iconName}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${pathContent}</symbol>`;
      });

      const spriteContent = `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join("")}</svg>`;
      const minifiedContent = minify(spriteContent, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      });

      const spriteFilePath = path.join(spritesDir, spriteFile);
      fs.writeFileSync(spriteFilePath, minifiedContent);

      console.log(`Sprite '${spriteFile}' generated successfully.`);
    });
  });
});
