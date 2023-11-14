const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const webpackConfig = require("./webpack.config");

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

function buildSources() {
  const compiler = webpack(webpackConfig);

  fs.rmdirSync(path.resolve(__dirname, "../dist"), { recursive: true });

  compiler.run(buildCallback);
}

buildSources();
