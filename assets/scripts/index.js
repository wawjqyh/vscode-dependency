function init() {
  window.vscode = acquireVsCodeApi();

  initData();

  if (store.operation === "getDisused") {
    disusedInit();
  }

  if (store.operation === "getDependencies" || store.operation === "getBeDependencies") {
    // sankeyInit();
    graphInit();
  }
}

init();
