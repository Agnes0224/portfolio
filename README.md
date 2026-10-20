# AI 产品经理个人作品集

独立的纯静态网站，无构建依赖。当前公开项目只有 TripSplit。

## 目录与维护

```text
index.html                 个人作品集首页
assets/site.css            首页样式
projects/tripsplit/
  index.html               定稿 TripSplit V2.2 完整案例
  base.css
  refinement.css
  full.css
  app.js
  assets/                  高保真原型与局部素材
projects/deepresearch/
  .gitkeep                 仅预留目录，不显示入口
.nojekyll                  直接发布静态文件，不经过 Jekyll
.gitignore
README.md
```

TripSplit 的 17 个运行文件逐字节复制，未改写原型、文案、样式或交互。没有复制业务后端、数据库、环境变量、PRD、内部验收记录或原仓库 Git 历史。

远程仓库：`git@github.com:Agnes0224/portfolio.git`。

网站采用项目站点路径：`https://agnes0224.github.io/portfolio/`；TripSplit 为 `https://agnes0224.github.io/portfolio/projects/tripsplit/`。

## 本地预览

在此目录打开终端：

```powershell
python -m http.server 5320 --bind 127.0.0.1
```

打开 `http://127.0.0.1:5320/`；项目案例为 `http://127.0.0.1:5320/projects/tripsplit/`。
不需要运行 TripSplit 后端、Worker、数据库或模型服务。

## GitHub Pages 配置

使用现有仓库 `Agnes0224/portfolio`，不另建或重命名仓库。

- 远程：`git@github.com:Agnes0224/portfolio.git`
- 发布分支：`main`
- Pages Source：**Deploy from a branch**
- Pages Folder：**/(root)**
- `.nojekyll` 已准备，无需 Node 构建或自定义 Actions YAML。

GitHub 会执行 Pages 发布任务。仓库名为 `portfolio`，所以网站 URL 含 `/portfolio/`，不是账号根域名。所有运行资源均使用相对路径，适配此项目路径。

首次初始化与绑定所用命令：

```powershell
git init -b main
git remote add origin git@github.com:Agnes0224/portfolio.git
git add index.html assets projects .nojekyll .gitignore README.md
git diff --cached --stat
git commit -m "Publish AI PM portfolio"
git push -u origin main
```

已经完成初始化后不要重复运行上述 `git init` 或 `git remote add`；日常使用下方更新命令即可。

认证使用现有 SSH；不将密钥、令牌写入项目或 remote URL。Pages 可在仓库 **Settings → Pages** 查看发布状态，部署记录见 **Actions**。

## 后续更新

直接编辑本仓库的静态源文件，然后提交：

```powershell
git status --short
git add index.html assets projects
git diff --cached --stat
git commit -m "Update portfolio content"
git push origin main
```

源分支更新后，GitHub Pages 会自动发布。不要同时维护一个必须手动同步的 `dist` 目录。

- **TripSplit 第 7、8 章**：内容与证据准备完成后，在 `projects/tripsplit/index.html` 的相应位置增加章节，并同步导航、样式和交互。当前没有占位或导航项。
- **DeepResearch**：准备完成后在预留目录加入 `index.html` 及自己的素材，再在个人首页增加入口。当前没有空白项目卡片。
- **更多项目**：每个项目使用独立目录及相对资源路径，防止样式互相污染。
- **原定稿与迁移后文件**：此目录是后续网站维护入口；原 TripSplit 业务仓库保留作原始基线。原版本的 `build.py` 不属于本站依赖，不要用它覆盖此处后续新增章节。

## 简明发布检查

- 从首页进入项目、直接打开项目路径均正常。
- 七章导航、手机方案切换、入账条件切换、证据标签与图片放大正常。
- 图片路径大小写一致，不依赖 localhost、磁盘绝对路径或业务 API。
- 检查演示样例标识；不要写入未经验证的指标、用户资料或凭据。

本地验证产物保存在被 Git 忽略的 `validation/` 中，不作为公开站点源码提交。

## 官方配置依据

- [GitHub Pages 快速入门](https://docs.github.com/en/pages/quickstart)
- [配置发布源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [创建 Pages 站点及 .nojekyll](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
