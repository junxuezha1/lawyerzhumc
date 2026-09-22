# 朱满成律师个人网站

正式网站：https://lawyerzhumc.com/

基于 Vite 的静态网站，包含五栏屏风导航、活动多图相册、专业文章及联系方式。五个栏目底部均提供「收起屏风」按钮。活动按「栏目 → 活动 → 照片」维护。

## 本地开发

使用 Node.js 22.12 或更新的受支持版本。

```sh
npm ci
npm run dev
```

## 构建与发布

```sh
npm run release
```

构建过程校验活动数据，同步栏目内容，再将脚本、样式和图片内嵌到 `release/index.html`。该文件可以离线打开，也可直接上传到现有 Cloudflare Worker `zhu-moreyield`。校验值写入 `release-manifest.json`。

GitHub Actions 自动检查构建，并提供 `website-release` 构建产物下载。提交代码不会自动改动正式域名；部署时上传构建产物中的 `index.html`。

## 内容维护

- `src/events.json`：活动、日期、来源、封面和照片数组。
- `public/assets/`：页面实际使用的图片。
- `index.html`：页面结构和专业文章；带 `events` 标记的区域由构建脚本生成。
- `src/`：屏风导航、相册交互和样式。
- `scripts/`：数据校验、内容同步及单文件打包。

维护步骤见 [CONTENT-GUIDE.md](CONTENT-GUIDE.md)，线上核对见 [DEPLOYMENT.md](DEPLOYMENT.md)。公众号文章目前保留原文链接，尚未实施全文站内收录。

## 权利说明

本项目用于该网站的维护与部署。照片、文章、姓名及相关资料不因保存到代码仓库而获得额外转载许可；使用前应取得相应权利人的许可。本仓库未授予开源许可证。
