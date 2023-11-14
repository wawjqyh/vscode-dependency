const path = require("path");

let assetsPath = "";

function setAssetsPath(extensionPath) {
  assetsPath = path.resolve(extensionPath, "./assets");
}

function getAssetsPath() {
  return assetsPath;
}

module.exports = {
  fileType: [".vue", ".js"],
  entry: [
    "./config",
    "./layouts",
    "./middleware",
    "./modules",
    "./plugins",
    "./pages",
    "./components",
  ],
  alias: {
    "@": "./",
    "~": "./",
  },
  setAssetsPath,
  getAssetsPath,
};
