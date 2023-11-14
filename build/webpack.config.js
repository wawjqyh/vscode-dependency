const path = require("path");

module.exports = {
  mode: "development",
  target: "node",
  node: {
    __dirname: false,
    __filename: false,
  },
  entry: path.resolve(__dirname, "../src/extension.js"),
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "extension.js",
    libraryTarget: "commonjs2",
  },
  externals: {
    vscode: "commonjs vscode", // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  },
  // loader
  module: {
    rules: [
      { test: /\.js/, type: "javascript/auto" },
      {
        test: /\.json$/,
        loader: "json-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".mjs", ".js", ".json"],
  },
  plugins: [],
  devtool: "source-map",
};
