const vscode = require("vscode");
const dependency = require("./dependency/index");
const webview = require("./webview");

// 根据配置的入口遍历文件，分析依赖关系输出到 .dependency/dependency.json
const cmdAnalyzeDependencies = vscode.commands.registerCommand(
  "dependency.cmdAnalyzeDependencies",
  dependency.analyses
);

const cmdGetDependencies = vscode.commands.registerCommand(
  "dependency.cmdGetDependencies",
  webview.webviewDependency
);

module.exports = {
  cmdAnalyzeDependencies,
  cmdGetDependencies,
  commands: [cmdAnalyzeDependencies, cmdGetDependencies],
};
