# 活动与多图维护

内容按「栏目 → 活动或项目 → 照片」组织。同一活动保留一个条目、一张封面和一组照片；不同日期或不同主题的活动各建条目。一个活动选一个主要栏目，可用 tags 补充关联主题，不因照片数量增加栏目卡片。

数据真源为 `src/events.json`。每项包含稳定 id、category、title、summary、可选 date、tags、source、cover，以及 photos 数组。每张照片包含 src、alt、caption。日期不明确时省略，不能猜测。聘书、现场照、合影可属于同一活动或项目；同一机构的不同活动不能仅因机构相同而合并。

增补同一活动照片：把图片放进 `public/assets/`，在对应条目的 photos 里增加记录，必要时修改 cover。新活动：增加一个新 id 的完整条目。当前 academic、social、cooperation、honors 四栏会自动生成活动卡片；未来 professional 新增活动时需为对应栏目增加同类生成槽位。

运行 `npm run release` 自动校验数据、同步首页卡片、构建页面，并生成 `release/index.html`。照片数量自动计算。只上传 release 目录中的成品，不能上传 src、review、generated 或 public 原素材目录。

网站为静态站点，尚无后台上传表单。将照片交给维护者即可按以上结构加入；相册浏览不会把用户文件自动上传到网站。
