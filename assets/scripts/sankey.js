function sankeyInit() {
  const { data, links } = getSankeyData();
  const options = {
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
    },
    series: {
      type: "sankey",
      layout: "none",
      emphasis: {
        focus: "adjacency",
      },
      nodeAlign: store.operation === "getBeDependencies" ? "right" : "left",
      draggable: false,
      animationDuration: 400,
      label: {
        formatter(params) {
          return params.name.split("/").pop();
        },
        color: "#fff",
        shadowColor: "transparent",
      },
      tooltip: {
        borderWidth: 0,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        textStyle: { color: "#fff" },
        formatter(params) {
          return params.name;
        },
      },
      data,
      links,
    },
  };

  chart.setOption(options);
}

function getSankeyData() {
  const fileDict = getFileDict(store.target);
  const dataDict = new Set(); // 校验重复文件
  const linkDict = new Set(); // 校验重复关系
  const data = []; // echarts data
  const links = []; // echarts links

  // 生成 chearts 的 data 和 links 配置
  const genOptions = (_fileInfo) => {
    // 生成 data 配置（需要去重）
    if (!dataDict.has(_fileInfo.relativePath)) {
      data.push({
        name: _fileInfo.relativePath,
        itemStyle: {
          color: getColor(_fileInfo.relativePath),
        },
      });
      dataDict.add(_fileInfo.relativePath);
    }

    if (_fileInfo.children?.length) {
      _fileInfo.children.forEach((_childPath) => {
        const source = _fileInfo.relativePath;
        const target = _childPath;

        // 去重
        if (linkDict.has(`${source}${target}`)) {
          return;
        } else {
          linkDict.add(`${source}${target}`);
        }

        // 生成 links 配置
        const childInfo = fileDict[_childPath];
        const hasChild = !!childInfo?.children?.length;
        const parentCount = childInfo?.parent?.length || 1;

        links.push({
          source,
          target,
          value: hasChild ? childInfo.value / parentCount : 1,
        });

        genOptions(fileDict[_childPath]);
      });
    }
  };

  // 获取入口的文件信息，从入口文件开始查找依赖
  if (fileDict[store.target]) {
    genOptions(fileDict[store.target]);
  }

  return { data, links };
}

/**
 * 获取入口下依赖的文件
 */
function getFileDict(_name) {
  const list = [];
  const dict = {};

  const fileInfo = JSON.parse(JSON.stringify(store.rootDataDict[_name]));
  if (store.operation === "getBeDependencies") switchChildren(fileInfo);

  // 获取入口下依赖的所有文件
  const getList = (_fileInfo) => {
    if (!dict[_fileInfo.relativePath]) {
      _fileInfo.parent = null;
      dict[_fileInfo.relativePath] = _fileInfo;
      list.push(_fileInfo);
    }

    if (_fileInfo?.children?.length) {
      _fileInfo.children.forEach((_childName) => {
        const childInfo = JSON.parse(
          JSON.stringify(store.rootDataDict[_childName])
        );
        if (store.operation === "getBeDependencies") switchChildren(childInfo);

        getList(childInfo);
      });
    }
  };

  getList(fileInfo);

  // 生成每个文件的父级列表
  list.forEach((_fileItem) => {
    const children = _fileItem.children;

    if (!_fileItem.parent) _fileItem.parent = [];

    if (children && children.length) {
      children.forEach((_key) => {
        const childFileItem = dict[_key];

        if (!childFileItem.parent) childFileItem.parent = [];

        const isExists = childFileItem.parent.some(
          (item) => item === _fileItem.relativePath
        );

        if (!isExists) {
          childFileItem.parent.push(_fileItem.relativePath);
        }
      });
    }
  });

  // 计算文件的依赖值
  const calcValue = (_fileInfo) => {
    const hasChild = !!_fileInfo?.children?.length;
    const parentCount = _fileInfo?.parent?.length || 1;
    let value = 0;

    if (hasChild) {
      _fileInfo.children.forEach((_childName) => {
        const childInfo = dict[_childName];

        value = value + calcValue(childInfo);
      });
    } else {
      value = 1;
    }

    _fileInfo.value = value;

    return hasChild ? value / parentCount : 1;
  };

  calcValue(dict[_name]);

  return dict;
}
