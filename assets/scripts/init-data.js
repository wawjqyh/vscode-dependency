function initData() {
  store.rootData.forEach((_fileItem) => {
    const key = _fileItem.relativePath;

    if (!store.rootDataDict[key]) {
      store.rootDataDict[key] = _fileItem;
    }
  });

  // 生成父级列表
  store.rootData.forEach((_fileItem) => {
    const children = _fileItem.children;

    if (!_fileItem.parent) _fileItem.parent = [];

    if (children && children.length) {
      children.forEach((_key) => {
        const childFileItem = store.rootDataDict[_key];

        if (!childFileItem) return;

        if (!childFileItem.parent) childFileItem.parent = [];

        const isExists = childFileItem.parent.some(
          (item) => item === _fileItem.relativePath
        );

        if (!isExists) {
          childFileItem.parent.push(_fileItem.relativePath);
        }
      });
    }
  });
}

function getColor(_url) {
  if (/.js$/.test(_url)) {
    return "rgb(255, 221, 0)";
  }

  if (/^\/page/.test(_url)) {
    return "rgb(0, 174, 255)";
  }

  if (/^\/components/.test(_url)) {
    return "#65b687";
  }
}

function switchChildren(_fileInfo) {
  const children = _fileInfo.children;
  const parent = _fileInfo.parent;

  _fileInfo.children = parent;
  _fileInfo.parent = children;
}
