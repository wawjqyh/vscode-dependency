const cmd = require("./command");
const config = require("./config");

function activate(context) {
  console.log("插件激活");

  config.setAssetsPath(context.extensionPath);

  cmd.commands.forEach((command) => {
    const cmd = command(context);

    context.subscriptions.push(cmd);
  });
}

function deactivate() {
  console.log("插件销毁");
}

module.exports = {
  activate,
  deactivate,
};
