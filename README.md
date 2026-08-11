# Xtruck OHW808 单品官网

这是一个面向海外客户的 Xtruck OHW808 英文单品官网项目。当前定位是“单产品官网 + 产品详情页 + WhatsApp 销售询盘落地页”，暂不接入数据库、登录、购物车或在线支付。

## 技术栈

- Vue 3
- Vite
- TypeScript
- Composition API
- `<script setup lang="ts">`
- ESLint
- Prettier
- npm

## 项目目录

```text
xtruck-site/
  public/
    images/        # 网站使用的本地图片
    videos/        # 网站使用的本地视频
    downloads/     # 后续放置真实下载文件
  src/
    assets/styles/ # 全局样式
    components/
      common/      # 通用组件
      layout/      # Header / Footer
      product/     # 产品页面模块
    config/site.ts # 站点配置
    data/product.ts# 产品内容数据
    types/         # TypeScript 类型
    App.vue
    main.ts
  CONTENT_NEEDED.md
```

原始素材保留在 `D:\MLS\source-assets`，网站内使用的是复制到 `public/` 下的文件。

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

本地预览生产构建：

```bash
npm run preview
```

代码检查：

```bash
npm run lint
```

## 内容修改位置

- 品牌名、WhatsApp 号码、默认 WhatsApp 消息、货币、支付开关、公司信息：
  `src/config/site.ts`
- 产品名称、型号、价格、图片、视频、功能、覆盖范围、下载资料、FAQ：
  `src/data/product.ts`

当前配置：

- 产品：`Xtruck OHW808`
- 价格：`$2399`
- WhatsApp：`8613684920569`
- 支付开关：`paymentsEnabled: false`

## 下载资料说明

首页靠前位置已经预留 `Downloads & Resources` 区域，用于展示说明书、软件、驱动、覆盖列表等资料。

目前没有真实下载文件，因此页面显示 `Coming Soon`，不会跳转到 404，也不会创建假的 PDF。后续拿到真实文件后：

1. 将文件放入 `public/downloads/`
2. 在 `src/data/product.ts` 的 `downloads` 数组中补充文件名、大小、版本、更新时间和 `href`
3. 将对应项目的 `status` 改为 `available`

## 后续详情文案

后续会提供 Word 文档，用于补充产品详情页的图文排版和详细英文文案。建议将确认后的内容整理进 `src/data/product.ts`，再按页面需要拆分成新的 Vue 组件。

## GitHub 仓库

目标仓库：

```text
https://github.com/mengyliu6/xtruck-site.git
```

初始化并推送：

```bash
git init
git add .
git commit -m "Build Xtruck OHW808 product site"
git branch -M main
git remote add origin https://github.com/mengyliu6/xtruck-site.git
git push -u origin main
```

不要提交密钥。未来 Stripe、PayPal 或服务端接口密钥必须放在 Vercel 环境变量中，不能写入前端代码。

## Vercel 准备

当前项目是标准 Vite 静态站点，可直接被 Vercel 识别。

- Build command：`npm run build`
- Output directory：`dist`
- Install command：`npm install`

当前不自动部署、不自动发布。
