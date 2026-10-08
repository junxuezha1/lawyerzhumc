# 发布状态

正式网站：https://lawyerzhumc.com/

托管：Cloudflare Worker `zhu-moreyield`。

域名注册商：阿里云。权威 DNS 已于 2026-10-08 从火山引擎迁移到 Cloudflare：

- `greg.ns.cloudflare.com`
- `lindsey.ns.cloudflare.com`

根域名 `lawyerzhumc.com` 与 `www.lawyerzhumc.com` 均连接到 Worker。原火山引擎服务器不再承载正式流量。

## 2026-10-08 新版上线

正式域名已读取到本次发布包，并与本地 `release/index.html` 逐字节一致：

- 大小：17,578,335 bytes。
- SHA-256：`5d87e8758501f787da88d55ee1db7ea31498485b8df20e0aef19546d32f7f492`。
- Cloudflare Worker 版本：`b9748034-88ba-43c8-8ccc-1ad3aed67cf7`。
- GitHub 源码提交：`397f0bc Update event galleries and activity photos`。
- 蒙古国访问按同一活动展示 4 张照片，总理接见合影为封面。
- 深圳少年警营展示 3 张照片。
- ICC 中文模拟法庭已替换错误照片，展示 2 张正确照片。
- 新增粤佛深三地律师协会立法工作交流座谈会，中南大学授课相册增加 2 张照片。
- 保留五层屏风、窗边海湾背景和各栏底部「收起屏风」按钮。

正式域名已在浏览器验证上述三个相册的照片数量、栏目展开和收起操作。Cloudflare 通用证书处于签发流程，备份证书已发放；HTTPS 已可正常访问。

## 2026-09-22 发布记录

2026-09-22 已通过正式域名读取完整 HTML，确认与 2026-09-17 的本地最终发布包逐字节对应：

- 大小：17,312,387 bytes。
- SHA-256：`9a84a833f70a90c39b92b14107e161bfb6fab928e7680fcd7ad8887fa56203cc`。
- 包含五栏屏风、窗边海湾背景、9 个活动及 14 张活动照片、蒙古论坛新闻、各栏底部「收起屏风」按钮。

此前 Cloudflare 首次上传失败，重试后的线上结果现已核实成功。

## 从仓库生成发布包

运行 `npm ci` 和 `npm run release`，只上传 `release/index.html`。不要把源码、依赖目录或维护文档作为站点文件上传。GitHub Actions 的 `website-release` 构建产物也包含发布 HTML 和校验清单。

GitHub 仓库用于源码管理，目前未配置自动发布到 Cloudflare。
