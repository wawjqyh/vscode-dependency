# Nuxt dependency graph

查看文件的依赖和被依赖关系，目前版本支持 nuxt2

入口配置了 `/config`、 `/layouts`、 `/middleware`、 `/modules`、 `/plugins`、 `/components`、 `/pages`，支持 `js` 和 `vue` 文件

支持查看以上目录下文件的依赖关系

## 功能

- **查看废弃的文件列表**：使用 `get disused` 命令
- **查看依赖**：右键菜单 `查看依赖`
- **查看被依赖**：右键菜单 `查看被依赖`

## 使用

使用前或者有增删文件时，先使用 `analyze dependencies` 命令生成依赖关系文件

这个文件保存在 `.dependency` 目录下，查看依赖关系时不会实时的获取依赖关系，而是从预先生成的依赖关系文件里面读取
