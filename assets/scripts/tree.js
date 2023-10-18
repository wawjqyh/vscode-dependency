function treeInit() {
  const chart = echarts.init(window.document.getElementById("chart"));
  const data = getTreeData();

  console.log(data);

  const options = {
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
    },
    series: {
      type: "tree",
      symbolSize: 8,
      leaves: {
        label: {
          position: "right",
          verticalAlign: "middle",
          align: "left",
        },
      },
      roam: true,
      emphasis: {
        focus: "relative",
      },
      nodeGap: 10,
      expandAndCollapse: true,
      initialTreeDepth: 3,
      lineStyle: {
        color: "#666",
      },
      label: {
        position: "left",
        verticalAlign: "middle",
        align: "right",
        fontSize: 12,
        color: "#fff",
        shadowColor: "transparent",
        formatter(params) {
          return params.name.split("/").pop();
        },
      },
      tooltip: {
        formatter(params) {
          return params.name;
        },
      },
      data,
    },
  };

  chart.setOption(options);

  chart.on("dblclick", "series.tree.label", (e) => {
    const fileData = store.rootDataDict[e.name];

    if (fileData) {
      window.vscode.postMessage({
        command: "openFile",
        url: fileData.absolutePath,
      });
    }
  });
}

function getTreeData() {
  const tree = [
    {
      name: store.target,
      label: { color: getColor(store.target) },
      children: [],
    },
  ];

  const genOptions = (_treeNode) => {
    let children = [];
    const fileData = store.rootDataDict[_treeNode.name];

    if (store.operation === "getDependencies")
      children = fileData.children || [];
    if (store.operation === "getBeDependencies")
      children = fileData.parent || [];

    if (children.length) {
      children.forEach((_childName) => {
        const treeNode = {
          name: _childName,
          label: { color: getColor(_childName) },
          children: [],
        };

        genOptions(treeNode);

        _treeNode.children.push(treeNode);
      });
    }
  };

  genOptions(tree[0]);

  return tree;
}

function getColor(_url) {
  if (/.js$/.test(_url)) {
    return "rgb(255, 221, 0)";
  }

  if (/^\/page/.test(_url)) {
    return "rgb(0, 174, 255)";
  }

  if (/^\/components/.test(_url)) {
    return "rgb(51, 190, 58)";
  }
}
