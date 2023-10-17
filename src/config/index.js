const path = require("path");

const assetsPath = path.resolve(__dirname, "../../assets");

module.exports = {
  fileType: [".vue", ".js"],
  entry: ["./pages", "./components"],
  alias: {
    "@": "./",
    "~": "./",
  },
  assetsPath,
};
