# 可直接交给 Codex 的指令

```text
请在当前仓库 https://github.com/mengyliu6/xtruck-site 中完成 Xtruck OHW808 单产品支付功能。

目标：
1. 根路径 `/` 保留为英文网站首页，首页的 OHW808 商品入口点击后跳转到 `/product/ohw808`。
2. 商品详情页只展示一张白底 OHW808 产品图、产品名称、2399 USD 价格、数量选择、支付区域和 WhatsApp 兼容性确认；商品详情描述区域先留空，后续再上传图文。
3. 支付方式使用 PayPal Checkout；另外提供香港银行转账申请，但不要把银行账号写进代码或公开显示。
4. 使用 Vercel Functions 实现服务端 PayPal 创建订单、捕获订单和 Webhook 验签。
5. 使用 Supabase PostgreSQL 保存订单和支付事件；客户浏览器不能直接读取订单表。
6. 第一版不开发独立后台，订单通过 Supabase Dashboard 管理。

约束：
- 保持 Vue 3 + Vite + TypeScript 和现有视觉风格，不迁移框架，不增加购物车、会员系统或多产品系统。
- 价格和订单金额必须由后端确定，不能信任前端提交的金额。
- 只有 PayPal 捕获结果或已验证 Webhook 才能将订单标记为 paid。
- PayPal Client Secret、Webhook ID、Supabase Service Role Key 只能使用 Vercel 环境变量，不能写入前端或提交 GitHub。
- 不保存银行卡号、CVV 或支付密码。
- 银行转账订单状态使用 awaiting_bank_transfer，管理员确认到账后人工改为 paid。
- 如果仓库已经存在上述功能，先检查现状，只补充缺失部分，不要重复重写。

需要输出：
- 可运行的前端页面与 Vercel API。
- `supabase/schema.sql` 数据库建表文件。
- `.env.example`，只放变量名称和占位符。
- 中文 `PAYMENT_SETUP.md`，写清楚老板或管理员需要在 Supabase、PayPal Developer 和 Vercel 中完成的步骤。
- 运行 npm run build、ESLint、后端 JavaScript 语法检查和 git diff --check。

完成标准：
- 首页能正常进入 `/product/ohw808`。
- 没有密钥时页面安全降级并提示尚未配置，不产生假支付成功。
- Sandbox 配置完成后可创建 PayPal 订单、捕获付款并在 Supabase 把订单更新为 paid。
- PayPal Webhook 已验签并能防止重复事件。
- 手机和电脑端页面均可使用。
- 不提交任何真实密钥或银行账户资料。
```
