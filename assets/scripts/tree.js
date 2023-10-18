function treeInit() {
  const data = getTreeData();

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
    const fileData = JSON.parse(JSON.stringify(store.rootDataDict[_treeNode.name]));
    if (store.operation === "getBeDependencies") switchChildren(fileData);
    const children = fileData.children;

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
