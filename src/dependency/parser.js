const config = require("../config/index");
const fsUtils = require("../utils/fsUtils");
const path = require("path");
const vueTemplateCompiler = require("vue-template-compiler");
const recast = require("recast");
const babelParser = require("recast/parsers/babel");
const Resolve = require("enhanced-resolve");

let resolve = null;

/**
 * 获取文件的依赖项，支持 js / vue
 * @param { String } _absPath
 * @param { String } _ext
 */
async function getDependency(_absPath, _ext) {
  const workspacePath = fsUtils.getWorkspacePath(); // 当前项目的绝对路径
  let importList = [];
  const content = await fsUtils.readFile(_absPath); // 读取文件内容
  const codeString = content.toString();

  if (_ext === ".vue") {
    importList = vueParser(codeString); // 解析 vue
  }
  if (_ext === ".js") {
    importList = jsParser(codeString);
  }

  // 将依赖项的地址转成绝对地址
  const dependencies = importList.reduce((res, item) => {
    const itemAbsPath = resolvePath(item, _absPath);

    // 不记录第三方包 | 非配置的入口目录下的文件
    if (item && itemAbsPath && !itemAbsPath.includes("node_modules") && fsUtils.checkInEntry(itemAbsPath)) {
      res.push(itemAbsPath.replace(workspacePath, ""));
    }

    return res;
  }, []);

  return dependencies;
}

/**
 * 解析 vue 文件
 * @param { String } _codeString
 * @todo 兼容 nuxt 的自动导入（不会显式的 import 组件）
 */
function vueParser(_codeString) {
  try {
    const compileResult = vueTemplateCompiler.parseComponent(_codeString); // 解析 vue
    const scriptString = compileResult?.script?.content || ""; // 获取 vue 中的 js 代码字符串

    const dependencies = jsParser(scriptString);

    return dependencies;
  } catch (err) {
    return Promise.reject(new Error({ msg: "vue 解析失败" }));
  }
}

/**
 * 解析JS代码字符串，获取依赖项
 * @param { String } _codeString JS代码字符串
 */
function jsParser(_codeString) {
  const dependencies = [];

  try {
    const ast = babelParser.parse(_codeString, {}); // js 词法分析

    recast.visit(ast, {
      // 遍历 js 中 import 的文件，每个 import 的文件都会进一次这个回调
      visitImportDeclaration(nodePath) {
        try {
          const importPath = nodePath?.node?.source?.value || "";

          if (importPath) dependencies.push(importPath);
        } catch (err) {
          console.log("获取 js 依赖失败");
        }

        return false;
      },
    });

    return dependencies;
  } catch (err) {
    return Promise.reject(new Error({ msg: "js 解析失败" }));
  }
}

/**
 * 将 import 路径处理成绝对路径
 * @param { String } _path import 文件的路径（即代码中 import 的路径）
 * @param {String} _absPath 当前文件的绝对路径
 */
function resolvePath(_importPath, _absPath) {
  const workspacePath = fsUtils.getWorkspacePath(); // 当前项目的绝对路径

  if (!resolve) {
    const alias = {};

    // 将配置中的 alias 相对路径处理成绝对路径
    for (const item in config.alias) {
      alias[item] = path.resolve(workspacePath, config.alias[item]);
    }

    resolve = Resolve.create.sync({
      extensions: [".vue", ".js"],
      alias: alias,
    });
  }

  try {
    const dirName = path.dirname(_absPath); // 当前文件所在文件夹的绝对路径
    const importAbsPath = resolve(dirName, _importPath);

    // return importAbsPath.replace(workspacePath, "");
    return importAbsPath;
  } catch (err) {
    console.log(`解析依赖文件路径失败：${_importPath}`);
  }

  return "";
}

module.exports = {
  getDependency,
};
