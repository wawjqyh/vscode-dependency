const vscode = require("vscode");
const dependency = require("./dependency/index");
const webview = require("./webview");

// 根据配置的入口遍历文件，分析依赖关系输出到 .dependency/dependency.json
function cmdAnalyzeDependencies(context) {
  return vscode.commands.registerCommand(
    "dependency.cmdAnalyzeDependencies",
    () => {
      dependency.analyses(context);
    }
  );
}

// 查看废弃的文件
function cmdGetDisused(context) {
  return vscode.commands.registerCommand("dependency.cmdGetDisused", () => {
    webview.webviewDisused(context);
  });
}

// 查看依赖关系
function cmdGetDependencies(context) {
  return vscode.commands.registerCommand(
    "dependency.cmdGetDependencies",
    (uri) => {
      webview.webviewDependency(context, uri, "getDependencies");
    }
  );
}

// 查看被依赖关系
function cmdGetBeDependencies(context) {
  return vscode.commands.registerCommand(
    "dependency.cmdGetBeDependencies",
    (uri) => {
      webview.webviewDependency(context, uri, "getBeDependencies");
    }
  );
}

module.exports = {
  cmdAnalyzeDependencies,
  cmdGetDependencies,
  commands: [cmdAnalyzeDependencies, cmdGetDisused, cmdGetDependencies, cmdGetBeDependencies],
};
