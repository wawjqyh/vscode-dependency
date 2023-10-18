function graphInit() {
  const chart = echarts.init(window.document.getElementById("chart"));
  const { data, links } = getGraphData();
  const options = {
    series: {
      type: "graph",
      layout: "circular",
      data,
      links,
      roam: true,
      label: {
        show: true,
        position: "right",
        formatter(params) {
          return params.name.split("/").pop();
        },
      },
      labelLayout: {
        hideOverlap: true,
      },
      tooltip: {
        formatter(params) {
          return params.name;
        },
      },
    },
  };

  console.log(options);

  chart.setOption(options);
}

function getGraphData() {
  const dataDict = new Set(); // 校验重复文件
  const linkDict = new Set(); // 校验重复关系
  const data = []; // echarts data
  const links = []; // echarts links

  // 生成 chearts 的 data 和 links 配置
  const genOptions = (_fileInfo) => {
    // 生成 data 配置（需要去重）
    if (!dataDict.has(_fileInfo.relativePath)) {
      data.push({ name: _fileInfo.relativePath });
      dataDict.add(_fileInfo.relativePath);
    }

    if (_fileInfo.children?.length) {
      _fileInfo.children.forEach((_childPath) => {
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
          genOptions(store.rootDataDict[_childPath])
        }
      });
    }
  };

  // 获取入口的文件信息，从入口文件开始查找依赖
  if (store.rootDataDict[store.target]) {
    genOptions(store.rootDataDict[store.target]);
  }

  return { data, links };
}
