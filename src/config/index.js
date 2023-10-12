const path = require("path");

const assetsPath = path.resolve(__dirname, "../../assets");

module.exports = {
  entry: ["./pages", "./components"],
  alias: {
    "@": "./",
    "~": "./",
  },
  assetsPath,
};
