# Xtruck OHW808 单品官网

这是一个面向海外客户的 Xtruck OHW808 英文单品官网项目。当前包含独立首页、OHW808 商品详情页、PayPal 在线支付、香港银行转账申请、WhatsApp 询盘和 Supabase 订单保存。

## 技术栈

- Vue 3
- Vite
- TypeScript
- Composition API
- `<script setup lang="ts">`
- ESLint
- Prettier
- npm
- Vercel Functions
- PayPal Checkout
- Supabase PostgreSQL

## 项目目录

```text
xtruck-site/
  public/
    images/        # 产品图和从资料表筛选的软件截图
    videos/        # 网站使用的本地视频
  src/
    assets/styles/ # 全局样式
    components/
      common/      # 通用组件
      layout/      # Header / Footer
      payment/     # PayPal 和银行转账组件
      product/     # 原产品详情模块，保留供后续内容恢复
    pages/         # 首页、商品页、Agent、Blog
    config/site.ts # 站点配置
    data/product.ts# 产品内容数据
    types/         # TypeScript 类型
    App.vue
    main.ts
  CONTENT_NEEDED.md
  CODEX_PAYMENT_PROMPT.md
  PAYMENT_SETUP.md
  api/             # Vercel 后端支付接口
  supabase/        # 数据库建表 SQL
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
- 产品名称、型号、价格、图片、功能、覆盖范围、参数、包装清单、FAQ：
  `src/data/product.ts`

当前配置：

- 产品：`Xtruck OHW808`
- 价格：`$2399`
- WhatsApp：`8613360519239`
- Email：`xtruck@qq.com`
- 支付开关：`paymentsEnabled: true`，但必须配置 PayPal 和 Supabase 环境变量后才能收款
- 已同步资料：产品介绍、硬件参数、支持语言、诊断功能、Cummins 操作流程、设备覆盖、附加工具、包装清单、FAQ 和保修边界

## 当前页面

- `/`：网站首页和 OHW808 商品入口
- `/product/ohw808`：商品图片、价格、数量、PayPal 和银行转账
- `/agent`：代理合作页面
- `/blog`：内容页面

商品详情页下方的详细描述区域暂时留空，等待正式英文图文资料和高清图片。

## 支付配置

支付代码不会把密钥写入前端。完成数据库、PayPal 和 Vercel 配置前，线上按钮不会执行真实收款。

请严格按照 [`PAYMENT_SETUP.md`](./PAYMENT_SETUP.md) 操作，并在 Supabase SQL Editor 中执行：

```text
supabase/schema.sql
```

## 下载资料说明

当前没有可公开下载的真实文件。页面的 Download 区域仅列出可以向 Xtruck 申请的官方资料，并通过 WhatsApp 获取匹配设备和软件版本的文件，不使用假链接或 Coming Soon 下载卡片。

## 后续详情文案

后续提供 Word 文档后，可继续补充经确认的产品图文内容。建议优先更新 `src/data/product.ts`，只在确有独立交互或版式需要时新增 Vue 组件。

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

GitHub `main` 分支更新后，由当前 Vercel 项目自动部署。正式支付上线前必须先通过 PayPal Sandbox 测试。
