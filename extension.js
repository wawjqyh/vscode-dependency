const cmd = require("./src/command");

function activate(context) {
  console.log("插件激活");

  cmd.commands.forEach((command) => {
    context.subscriptions.push(command);
  });
}

function deactivate() {
  console.log("插件销毁");
}

module.exports = {
  activate,
  deactivate,
};
