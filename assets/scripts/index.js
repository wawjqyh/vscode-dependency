function initData() {
  if (store.operation === "getDependencies") {
    window.depMap = new Map();

    store.rootData.forEach((item) => {
      window.depMap.set(item.relativePath, item);
    });
  }
}

function sankeyData() {
  const dataSet = new Set();
  const data = [];
  const links = [];

  const genData = (item) => {
    let value = 0;

    if (!dataSet.has(item.relativePath)) {
      data.push({ name: item.relativePath });
      dataSet.add(item.relativePath);
    }

    if (item.dependency?.length) {
      item.dependency.forEach((dep) => {
        const linksObj = {
          source: item.relativePath,
          target: dep,
          value: 1,
        };
        links.push(linksObj);

        if (window.depMap.has(dep)) {
          // linksObj.value = genData(window.depMap.get(dep));
        }

        value ++;
      });
    } else {
      value = 1;
    }

    return value;
  };

  if (window.depMap.has(store.target)) {
    genData(window.depMap.get(store.target));
  }

  console.log(data);
  console.log(links);

  return { data, links };
}

function sankeyInit() {
  const chart = echarts.init(window.document.getElementById("chart"));
  const { data, links } = sankeyData();
  const options = {
    series: {
      type: "sankey",
      layout: "none",
      emphasis: {
        focus: "adjacency",
      },
      nodeAlign: "left",
      data,
      links,
    },
  };

  chart.setOption(options);
}

initData();
sankeyInit();
