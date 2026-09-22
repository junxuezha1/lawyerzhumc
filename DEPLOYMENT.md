# 发布状态

正式网站：https://lawyerzhumc.com/

托管：Cloudflare Worker `zhu-moreyield`。

2026-09-22 已通过正式域名读取完整 HTML，确认与 2026-09-17 的本地最终发布包逐字节对应：

- 大小：17,312,387 bytes。
- SHA-256：`9a84a833f70a90c39b92b14107e161bfb6fab928e7680fcd7ad8887fa56203cc`。
- 包含五栏屏风、窗边海湾背景、9 个活动及 14 张活动照片、蒙古论坛新闻、各栏底部「收起屏风」按钮。

此前 Cloudflare 首次上传失败，重试后的线上结果现已核实成功。

## 从仓库生成发布包

运行 `npm ci` 和 `npm run release`，只上传 `release/index.html`。不要把源码、依赖目录或维护文档作为站点文件上传。GitHub Actions 的 `website-release` 构建产物也包含发布 HTML 和校验清单。

GitHub 仓库用于源码管理，目前未配置自动发布到 Cloudflare。
