// 根据配置的入口遍历文件，分析依赖关系输出到 .vscode/dependency.json

const vscode = require("vscode");
const path = require("path");
const fsUtils = require("../utils/fsUtils");
const parser = require("./parser");
const config = require("../config/index");

/**
 * 读取配置文件中的入口列表，从入口列表遍历里面的文件
 * 获取每个文件的依赖，统一收集放在 .dependency/dependency.json 中
 */
async function start() {
  // 展示进度条
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "解析依赖",
      cancellable: false,
    },
    (progress) => {
      return new Promise(async (resolve) => {
        progress.report({ message: "获取依赖关系中..." });

        try {
          const list = [];
          const entryList = config.entry; // 入口列表
          const workspacePath = fsUtils.getWorkspacePath(); // 当前项目的绝对路径
          const dataDirPath = path.resolve(workspacePath, "./.dependency");
          const dataPath = path.resolve(
            workspacePath,
            "./.dependency/dependency.json"
          );

          // 从入口递归遍历文件夹下的文件
          for (const entry of entryList) {
            const dirAbsPath = path.join(workspacePath, entry); // 入口的绝对路径
            const isExists = fsUtils.checkPathExists(dirAbsPath); // 判断入口是否存在

            if (isExists) {
              const dirInfo = await fsUtils.getFileData(dirAbsPath);

              await analysesDir(dirInfo, list);
            }
          }

          // 判断保存依赖数据的文件夹是否存在
          if (!fsUtils.checkPathExists(dataDirPath)) {
            await fsUtils.mkdir(dataDirPath);
          }

          await fsUtils.writeFile(dataPath, JSON.stringify(list));

          // 关闭进度条
          progress.report({ increment: 100, message: "获取依赖关系完成！" });
          setTimeout(() => {
            resolve();
          }, 2000);
        } catch (err) {
          resolve();

          if (err.msg) {
            vscode.window.showErrorMessage(err.msg);
          }

          vscode.window.showErrorMessage("获取依赖关系失败");
        }
      });
    }
  );
}

/**
 * 递归读取文件夹下的文件，获取文件的依赖添加的总列表中
 * @param {Object} _dirInfo
 * @param {Array} _list
 */
async function analysesDir(_dirInfo, _list) {
  const fileList = await fsUtils.readDir(_dirInfo.absolutePath);

  for (const filename of fileList) {
    const absPath = path.join(_dirInfo.absolutePath, filename);
    const fileInfo = await fsUtils.getFileData(absPath);

    if (fileInfo.isDirectory) {
      await analysesDir(fileInfo, _list);
    } else if (fsUtils.checkFileType(fileInfo.ext)) {
      const dependency = await parser.getDependency(
        fileInfo.absolutePath,
        fileInfo.ext
      );

      if (dependency) {
        fileInfo.children = dependency;
      }

      _list.push(fileInfo);
    }
  }
}

module.exports = {
  start,
};
