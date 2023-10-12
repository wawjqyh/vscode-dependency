const fs = require("fs");
const path = require("path");
const vscode = require("vscode");

const fsPromise = fs.promises;

/**
 * @desc 读取文件夹下的文件列表
 */
async function readDir(_absPath) {
  try {
    return await fsPromise.readdir(_absPath);
  } catch (err) {
    return Promise.reject(new Error({ msg: `读取文件夹失败: ${_absPath}` }));
  }
}

async function getStats(_absPath) {
  try {
    return await fsPromise.stat(_absPath);
  } catch (err) {
    return Promise.reject(new Error({ msg: `读取文件信息失败: ${_absPath}` }));
  }
}

async function readFile(_absPath) {
  try {
    return await fsPromise.readFile(_absPath);
  } catch (err) {
    return Promise.reject(new Error({ msg: `读取文件失败: ${_absPath}` }));
  }
}

async function writeFile(_absPath, data) {
  try {
    return await fsPromise.writeFile(_absPath, data);
  } catch (err) {
    return Promise.reject(new Error({ msg: `写入文件失败: ${_absPath}` }));
  }
}

async function mkdir(_absPath) {
  try {
    return await fsPromise.mkdir(_absPath);
  } catch (err) {
    return Promise.reject(new Error({ msg: `创建文件夹失败: ${_absPath}` }));
  }
}

function checkPathExists(path) {
  try {
    fs.accessSync(path);
  } catch (err) {
    return false;
  }
  return true;
}

function getWorkspacePath() {
  const workspace = vscode.workspace;
  let folder = workspace.workspaceFolders;
  let folderPath = "";

  if (folder !== undefined) {
    folderPath = folder[0].uri.fsPath;
  }

  return folderPath;
}

/**
 * 获取文件/文件夹信息
 * @param {String} _absPath
 * @returns {Object} { name, relativePath, absolutePath, isDirectory, ext }
 */
async function getFileData(_absPath) {
  const workspacePath = getWorkspacePath();
  const relativePath = _absPath.replace(workspacePath, "");
  const name = _absPath.split("/").pop();
  const stats = await getStats(_absPath);
  const isDirectory = stats.isDirectory();

  const data = {
    name,
    relativePath,
    absolutePath: _absPath,
    isDirectory,
  };

  if (!isDirectory) {
    data.ext = path.extname(_absPath).toLowerCase();
  }

  return data;
}

module.exports = {
  readDir,
  getStats,
  readFile,
  writeFile,
  checkPathExists,
  getWorkspacePath,
  getFileData,
  mkdir
};
