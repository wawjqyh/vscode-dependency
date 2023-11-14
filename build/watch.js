const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const webpackConfig = require("./webpack.config");

const watchOptions = {
  aggregateTimeout: 300,
  ignored: /node_modules/,
  poll: 1000,
};

const buildCallback = (err, stats) => {
  let messages;
  if (err) {
    messages = {
      errors: [err.message],
    };
    console.log(messages);
  } else {
    messages = stats.toJson({ all: false, warnings: true, errors: true });
  }
  if (messages.errors.length) {
    console.error(messages.errors);
  }
};

function watchSources() {
  const compiler = webpack(webpackConfig);
  compiler.watch(watchOptions, buildCallback);
}

watchSources();
