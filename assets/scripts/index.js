function getDataDependency(_target) {
  const dataMap = new Map();
  const chartData = [];
  const chartLinks = [];

  data.forEach((item) => {
    dataMap.set(item.relativePath, item);
  });

  const genData = (item) => {
    chartData.push({ name: item.relativePath });

    if (item.dependency?.length) {
      item.dependency.forEach((dep) => {
        chartLinks.push({
          source: item.relativePath,
          target: dep,
          value: 1,
        });

        if (dataMap.has(dep)) {
          genData(dataMap.get(dep));
        }
      });
    }
  };

  if (dataMap.has(_target)) {
    genData(dataMap.get(_target));
  }

  console.log(chartData);
  console.log(chartLinks);
}

getDataDependency(target);
