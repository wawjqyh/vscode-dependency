const vscode = require("vscode");
const dependency = require("./dependency/index");
const webview = require("./webview");

// 根据配置的入口遍历文件，分析依赖关系输出到 .dependency/dependency.json
const cmdAnalyzeDependencies = vscode.commands.registerCommand(
  "dependency.cmdAnalyzeDependencies",
  dependency.analyses
);

// 查看废弃的文件
const cmdGetDisused = vscode.commands.registerCommand(
  "dependency.cmdGetDisused",
  webview.webviewDisused
);

// 查看依赖关系
const cmdGetDependencies = vscode.commands.registerCommand(
  "dependency.cmdGetDependencies",
  (uri) => {
    webview.webviewDependency(uri, "getDependencies");
  }
);

module.exports = {
  cmdAnalyzeDependencies,
  cmdGetDependencies,
  commands: [cmdAnalyzeDependencies, cmdGetDisused, cmdGetDependencies],
};
