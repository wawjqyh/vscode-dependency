function initData() {
  if (store.operation === "getDependencies") {
    store.rootData.forEach((_fileItem) => {
      store.rootDataDict[_fileItem.relativePath] = _fileItem;
    });
  }
}

function sankeyData() {
  const linkDataDict = {};
  const dataDict = new Set(); // 校验重复文件
  const linkDict = new Set(); // 校验重复关系
  const data = []; // echarts data
  const links = []; // echarts links

  // 生成 chearts 的 data 和 links 配置
  const genOptions = (_fileInfo) => {
    let val = 0;

    // 生成 data 配置（需要去重）
    if (!dataDict.has(_fileInfo.relativePath)) {
      data.push({ name: _fileInfo.relativePath });
      dataDict.add(_fileInfo.relativePath);
    }

    if (_fileInfo.dependency?.length) {
      _fileInfo.dependency.forEach((_childPath) => {
        let value = 0;
        const source = _fileInfo.relativePath;
        const target = _childPath;
        const linkData = { source, target };

        // 去重
        if (linkDict.has(`${source}${target}`)) {
          return;
        } else {
          linkDict.add(`${source}${target}`);
        }

        // 生成 links 配置
        links.push(linkData);

        if (store.rootDataDict[_childPath]) {
          value = genOptions(store.rootDataDict[_childPath]) || 1;
          val = val + value; // 累加父级的 value
        }

        // 设置 links value
        linkData.value = value; // 当前 link 的 value
      });
    } else {
      val = 1;
    }

    return val;
  };

  // 获取入口的文件信息，从入口文件开始查找依赖
  if (store.rootDataDict[store.target]) {
    genOptions(store.rootDataDict[store.target]);
  }

  return { data, links };
}

function sankeyInit() {
  const chart = echarts.init(window.document.getElementById("chart"));
  const { data, links } = sankeyData();
  const options = {
    /* tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
    }, */
    series: {
      type: "sankey",
      layout: "none",
      emphasis: {
        focus: "adjacency",
      },
      nodeAlign: "left",
      draggable: false,
      selectedMode: "single",
      select: {
        disabled: false,
      },
      label: {
        formatter(params) {
          return params.name.split("/").pop();
        },
        color: "#fff",
        shadowColor: "transparent",
      },
      data,
      links,
    },
  };

  chart.setOption(options);
}

initData();
sankeyInit();
