function disusedInit() {
  const disused = getDisused();

  renderDisused(disused);
  bindEvent();
}

function getDisused() {
  const used = new Set();
  const disused = [];
  /* 过滤非 components 下的文件 */
  const pages = store.rootData
    .filter((_item) => {
      return !/^\/components/.test(_item.relativePath);
    })
    .map((_item) => {
      return _item.relativePath;
    });

  const checkUsed = (_list) => {
    _list.forEach((_item) => {
      const _itemData = store.rootDataDict[_item];

      used.add(_item);

      if (_itemData?.children?.length) {
        checkUsed(_itemData.children);
      }
    });
  };

  checkUsed(pages);

  store.rootData.forEach((_item) => {
    if (!used.has(_item.relativePath)) {
      disused.push({
        name: _item.name,
        relativePath: _item.relativePath,
        absolutePath: _item.absolutePath,
      });
    }
  });

  return disused;
}

function renderDisused(_list) {
  const wrapper = window.document.getElementById("disused");
  let html = "";

  _list.forEach((_item) => {
    html += `<li class="disused-item" data-file="${_item.absolutePath}">${_item.relativePath}</li>`;
  });

  wrapper.insertAdjacentHTML("afterbegin", html);
}

function bindEvent() {
  const wrapper = window.document.getElementById("disused");

  wrapper.addEventListener("click", (e) => {
    const file = getAncestorData(e.target, "file");

    window.vscode.postMessage({
      command: "openFile",
      url: file,
    });
  });
}

function getAncestorData(elem, prop = "index") {
  if (elem && elem.dataset) {
    const index = elem.dataset[prop];

    return index || getAncestorData(elem.parentNode);
  }
}
