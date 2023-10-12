const vscode = require("vscode");
const path = require("path");
const config = require("../config");

function webviewDependency(uri) {
  const filePath = uri.path.substring(1);

  const panel = vscode.window.createWebviewPanel(
    "webviewDependency", // 只供内部使用，这个webview的标识
    "666", // 给用户显示的面板标题
    vscode.ViewColumn.One, // 给新的webview面板一个编辑器视图
    {
      enableScripts: true,
    }
  );

  // 设置HTML内容
  panel.webview.html = getWebviewContent(panel);
}

function getWebviewContent(panel) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>666</title>

      <link rel="stylesheet" type="text/css" href="${getStaticUrl('css/index.css', panel)}" />
    </head>
    <body>
      <div class="test">2333</div>

      
      <script src="${getStaticUrl('scripts/index.js', panel)}"></script>
    </body>
    </html>
  `;
}

function getStaticUrl(url, panel) {
  const onDiskPath = vscode.Uri.file(path.resolve(config.assetsPath, url));

  return panel.webview.asWebviewUri(onDiskPath).toString();
}

module.exports = {
  webviewDependency,
};
