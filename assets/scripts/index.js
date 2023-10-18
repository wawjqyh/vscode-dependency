const chart = echarts.init(window.document.getElementById("chart"));
let chartType = "sankey";

chart.on("dblclick", "series.sankey.item", (e) => {
  emitOpenFile(e);
});
chart.on("dblclick", "series.tree.item", (e) => {
  emitOpenFile(e);
});

function init() {
  window.vscode = acquireVsCodeApi();

  initData();

  if (store.operation === "getDisused") {
    disusedInit();
  }

  if (
    store.operation === "getDependencies" ||
    store.operation === "getBeDependencies"
  ) {
    sankeyInit();

    switchChart();
  }
}

function emitOpenFile(e) {
  const fileData = store.rootDataDict[e.name];

  if (fileData) {
    window.vscode.postMessage({
      command: "openFile",
      url: fileData.absolutePath,
    });
  }
}

function switchChart() {
  window.document.getElementById("btnTree").addEventListener("click", () => {
    if (chartType === "tree") return;

    chartType = "tree";
    treeInit();
  });

  window.document.getElementById("btnSankey").addEventListener("click", () => {
    if (chartType === "sankey") return;

    chartType = "sankey";
    sankeyInit();
  });
}

init();
