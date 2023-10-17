const vscode = require("vscode");
const path = require("path");
const fsUtils = require("../utils/fsUtils");
const config = require("../config");

async function webviewDependency(uri, operation) {
  try {
    const filePath = uri.path;
    const fileInfo = await fsUtils.getFileData(filePath);

    // 判断依赖关系文件是否存在，并读取
    const workspacePath = fsUtils.getWorkspacePath(); // 当前项目的绝对路径
    const depFilePath = path.resolve(
      workspacePath,
      "./.dependency/dependency.json"
    );
    const isExists = fsUtils.checkPathExists(depFilePath);
    let dataStr = "";

    if (isExists) {
      const dependencyContent = await fsUtils.readFile(depFilePath);
      dataStr = dependencyContent.toString();
    } else {
      vscode.window.showErrorMessage("未读取到依赖关系文件，请先执行 ");
      return;
    }

    // 文件夹｜配置支持的文件类型｜配置的入口
    if (
      fileInfo.isDirectory ||
      !fsUtils.checkFileType(fileInfo.ext) ||
      !fsUtils.checkInEntry(filePath)
    ) {
      vscode.window.showErrorMessage(`${fileInfo.name}: 文件不支持`);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "webviewDependency", // 只供内部使用，这个webview的标识
      fileInfo.name, // 给用户显示的面板标题
      vscode.ViewColumn.One, // 给新的webview面板一个编辑器视图
      {
        enableScripts: true,
      }
    );

    // 设置HTML内容
    panel.webview.html = getWebviewContent(
      panel,
      fileInfo.relativePath,
      operation,
      dataStr
    );
  } catch (err) {
    console.log(err);
  }
}

function getWebviewContent(panel, target, operation, dataStr) {
  const staticPath = getStaticPath(panel);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>dependency</title>

      <link rel="stylesheet" type="text/css" href="${staticPath}/css/index.css" />
    </head>
    <body>
      <div class="test">2333</div>

      <script>
        const staticPath = "${staticPath}";
        const operation = "${operation}";
        const data = ${dataStr};
        const target = "${target}";
      </script>
      <script src="${staticPath}/scripts/index.js"></script>
    </body>
    </html>
  `;
}

/**
 * 获取静态资源目录
 * @param {Object} panel 窗口实例
 * @returns
 */
function getStaticPath(panel) {
  const onDiskPath = vscode.Uri.file(config.assetsPath);

  return panel.webview.asWebviewUri(onDiskPath).toString();
}

module.exports = {
  webviewDependency,
};
