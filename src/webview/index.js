const vscode = require("vscode");
const path = require("path");
const fsUtils = require("../utils/fsUtils");
const config = require("../config");

/**
 * 查看废弃的文件
 */
async function webviewDisused(context) {
  try {
    const dataStr = await getDependencyData();

    if (!dataStr) return;

    // 创建 webview 窗口
    const panel = vscode.window.createWebviewPanel(
      "webviewDisused", // 只供内部使用，这个webview的标识
      "废弃文件", // 给用户显示的面板标题
      vscode.ViewColumn.One, // 给新的webview面板一个编辑器视图
      {
        enableScripts: true,
      }
    );

    // 设置HTML内容
    panel.webview.html = getWebviewContent(panel, null, "getDisused", dataStr);

    // 监听 webview 传出来的事件
    panel.webview.onDidReceiveMessage(
      async (message) => {
        try {
          if (message.command === "openFile") {
            await vscode.commands.executeCommand(
              "vscode.openFolder",
              vscode.Uri.file(message.url)
            );
          }
        } catch (err) {
          vscode.window.showErrorMessage("无法打开文件");
        }
      },
      undefined,
      context.subscriptions
    );
  } catch (err) {
    console.log(err);
    vscode.window.showErrorMessage("查看废弃文件失败！");
  }
}

/**
 * 查看依赖关系和被依赖关系
 * @param {*} uri
 * @param {*} operation 操作，查看依赖/被依赖
 * @returns
 */
async function webviewDependency(context, uri, operation) {
  try {
    const filePath = uri.path;
    const fileInfo = await fsUtils.getFileData(filePath);
    const dataStr = await getDependencyData();

    if (!dataStr) return;

    // 校验 文件夹｜配置支持的文件类型｜配置的入口内的文件
    if (
      fileInfo.isDirectory ||
      !fsUtils.checkFileType(fileInfo.ext) ||
      !fsUtils.checkInEntry(filePath)
    ) {
      vscode.window.showErrorMessage(`${fileInfo.name}: 文件不支持`);
      return;
    }

    // 创建 webview 窗口
    const panel = vscode.window.createWebviewPanel(
      "webviewDependency", // 只供内部使用，这个webview的标识
      fileInfo.name, // 给用户显示的面板标题
      vscode.ViewColumn.One, // 给新的webview面板一个编辑器视图
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    // 设置HTML内容
    panel.webview.html = getWebviewContent(
      panel,
      fileInfo.relativePath,
      operation,
      dataStr
    );

    // 监听 webview 传出来的事件
    panel.webview.onDidReceiveMessage(
      async (message) => {
        try {
          if (message.command === "openFile") {
            await vscode.commands.executeCommand(
              "vscode.openFolder",
              vscode.Uri.file(message.url)
            );
          }
        } catch (err) {
          vscode.window.showErrorMessage("无法打开文件");
        }
      },
      undefined,
      context.subscriptions
    );
  } catch (err) {
    console.log(err);
    vscode.window.showErrorMessage("查看依赖关系失败！");
  }
}

async function getDependencyData(context) {
  try {
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

      return dataStr;
    } else {
      vscode.window.showErrorMessage("未读取到依赖关系文件，请先执行");
    }
  } catch (err) {
    console.log(err);
    vscode.window.showErrorMessage("读取依赖关系文件失败");
  }

  return "";
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
      <div class="chart-wrapper" 
        style="${operation === "getDisused" ? "display: none" : ""}">
        <div id="chart"></div>

        <div class="btn-wrapper">
          <div class="btn-item" id="btnTree">树图</div>
          <div class="btn-item" id="btnSankey">桑葚图</div>
        </div>
      </div>

      <div class="disused-wrapper"
        style="${operation === "getDisused" ? "" : "display: none"}">
        <ul id="disused"></ul>
      </div>

      <script>
        const store = {
          staticPath: "${staticPath}",
          operation: "${operation}",
          target: "${target}",
          rootData: ${dataStr},

          rootDataDict: {}
        };
      </script>
      <script src="${staticPath}/scripts/echarts.min.js"></script>
      <script src="${staticPath}/scripts/init-data.js"></script>
      <script src="${staticPath}/scripts/disused.js"></script>
      <script src="${staticPath}/scripts/tree.js"></script>
      <script src="${staticPath}/scripts/graph.js"></script>
      <script src="${staticPath}/scripts/sankey.js"></script>
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
  webviewDisused,
  webviewDependency,
};
