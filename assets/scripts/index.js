function init() {
  initData();

  if (store.operation === "getDisused") {
    disusedInit();
  }

  if (store.operation === "getDependencies") {
    sankeyInit();
  }
}
