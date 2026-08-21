# Xtruck 订单后台配置

本文档用于配置现有 Xtruck Vercel Project 的订单后台、Supabase 数据表和 Resend 邮件。后台继续使用当前 GitHub 仓库、Vercel Project 和 Supabase Project。

配置过程中不要把真实密码、API Key 或 Secret 提交到 GitHub，也不要通过聊天发送这些信息。

## 1. 执行 Supabase Migration

1. 登录 Supabase，进入当前 Xtruck 项目。
2. 打开 **SQL Editor**，新建一个 Query。
3. 打开项目文件：

   `supabase/admin-order-management-migration.sql`

4. 将该文件的完整 SQL 粘贴到 SQL Editor。
5. 确认当前选中的是正式使用的 Xtruck Supabase Project，然后点击 **Run**。

该 SQL 可以重复执行，不会删除现有订单。它会完成以下修改：

- 给 `orders` 增加 `shipping_carrier`
- 给 `orders` 增加 `tracking_number`
- 给 `orders` 增加 `confirmation_email_sent_at`
- 给 `orders` 增加 `shipping_email_sent_at`
- 新增 `email_templates` 表
- 写入订单确认和发货通知的默认英文模板
- 保持 RLS 开启，不向匿名用户开放订单和模板

执行后，可在 Supabase 的 **Table Editor** 中确认：

1. `orders` 表出现上述四个新字段。
2. `email_templates` 表包含以下两行：
   - `order_confirmation`
   - `shipping_update`

也可以在 SQL Editor 执行以下只读检查：

```sql
select key, subject, updated_at
from public.email_templates
order by key;
```

如果 migration 报告某个字段或索引已经存在，通常表示之前执行过部分 SQL；重新执行完整文件即可。

## 2. 生成管理员密码 Hash

管理员密码不会保存为明文。请在本机项目目录 `D:\MLS\xtruck-site` 中运行：

```bash
npm run admin:hash-password -- "your-strong-password"
```

要求和注意事项：

- 密码至少 12 位，建议同时包含大小写字母、数字和符号。
- 命令输出以 `scrypt$` 开头。
- 将整行输出完整填入 Vercel 的 `ADMIN_PASSWORD_HASH`。
- 不要手动删除或修改 Hash 中的 `$` 字符。
- 不要把明文密码或生成的 Hash 写进 `.env.example`、README 或源代码。
- 该命令会把参数留在当前终端的命令历史中，请使用自己的安全电脑和私人终端运行。

以后修改管理员密码时，重新运行该命令生成 Hash，替换 Vercel 中的 `ADMIN_PASSWORD_HASH`，然后重新部署。

## 3. 生成 Session Secret

`ADMIN_SESSION_SECRET` 用于签名管理员登录 Session，必须是不可预测的随机字符串，至少 32 个字符。

可以在本机运行：

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

将输出填入 Vercel 的 `ADMIN_SESSION_SECRET`。更换该值会立即让之前的管理员 Session 失效，需要重新登录。

## 4. 添加 Vercel 环境变量

1. 登录 Vercel。
2. 打开当前 `xtruck-site` Project。
3. 进入 **Settings > Environment Variables**。
4. 依次添加以下变量：

```env
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD_HASH=generated_scrypt_hash
ADMIN_SESSION_SECRET=generated_random_session_secret
RESEND_API_KEY=re_xxxxxxxxx
ORDER_EMAIL_FROM=Xtruck Orders <orders@your_verified_domain.com>
```

变量说明：

| 变量                   | 用途            | 要求                                  |
| ---------------------- | --------------- | ------------------------------------- |
| `ADMIN_USERNAME`       | 后台登录用户名  | 不使用邮箱也可以，不要公开展示        |
| `ADMIN_PASSWORD_HASH`  | 管理员密码 Hash | 必须使用上一步生成的完整 `scrypt$...` |
| `ADMIN_SESSION_SECRET` | Session 签名    | 至少 32 个随机字符                    |
| `RESEND_API_KEY`       | 服务端发送邮件  | 从 Resend 创建，以 `re_` 开头         |
| `ORDER_EMAIL_FROM`     | 订单邮件发件人  | 必须使用 Resend 已验证域名下的地址    |

建议先同时勾选 **Preview** 和 **Production**。这些变量全部是服务端 Secret：

- 不要添加 `VITE_` 前缀。
- 不要写入 `.env.example` 的真实值。
- 不要在浏览器代码中读取。
- 不要删除现有的 PayPal、Supabase 和商品价格变量。
- PayPal 继续保持 `PAYPAL_ENV=sandbox`，直到完整测试通过。

修改环境变量后，进入 Vercel **Deployments**，对目标 Deployment 执行 **Redeploy**。环境变量不会自动进入已经完成的旧 Deployment。

## 5. 绑定后台域名

后台域名使用：

`admin.xtruckohw808.com`

操作步骤：

1. 打开当前 Vercel Project。
2. 进入 **Settings > Domains**。
3. 点击 **Add Domain**。
4. 输入 `admin.xtruckohw808.com` 并添加到当前 Project。
5. 查看 Vercel 给出的 DNS 配置要求。
6. 到 `xtruckohw808.com` 当前使用的 DNS 服务商添加对应记录。

`admin` 是子域名，Vercel 通常会要求添加 CNAME。记录名称一般为 `admin`，记录值必须以 Vercel 当前页面显示的值为准，不要猜测或照搬其他项目的 CNAME。

完成 DNS 后回到 Vercel Domains 页面，等待以下状态正常：

- Domain 显示配置有效。
- SSL Certificate 自动签发完成。
- `https://admin.xtruckohw808.com` 可以打开。

同一个 Vercel Project 可以同时绑定：

- `www.xtruckohw808.com`：客户网站
- `admin.xtruckohw808.com`：订单后台

代码会根据 hostname 区分前后台。不要创建第二个 Vercel Project。客户域名访问 `/admin` 会跳回首页。

## 6. 配置 Resend

### 6.1 添加发信域名

1. 登录 Resend。
2. 进入 **Domains**。
3. 点击 **Add Domain**。
4. 添加要用于订单邮件的域名。

可以使用主域名，也可以使用专门的发信子域名，例如：

`mail.xtruckohw808.com`

使用独立发信子域名通常更方便管理邮件 DNS。

### 6.2 配置 DNS

Resend 会显示需要添加的 SPF、DKIM 等 DNS 记录。到当前 DNS 服务商逐条添加，记录类型、名称和值必须与 Resend 页面完全一致。

建议同时根据 Resend 提示配置 DMARC。添加后回到 Resend 点击验证，等待 Domain 状态变成 **Verified**。DNS 生效可能需要几分钟或更长时间。

### 6.3 创建 API Key

1. 在 Resend 打开 **API Keys**。
2. 创建一个用于 Xtruck 订单邮件的 API Key。
3. 将它填入 Vercel 的 `RESEND_API_KEY`。
4. API Key 只保存到 Vercel，不要提交到 GitHub。

### 6.4 设置发件人

`ORDER_EMAIL_FROM` 必须使用已验证域名，例如：

```env
ORDER_EMAIL_FROM=Xtruck Orders <orders@mail.xtruckohw808.com>
```

如果验证的是 `xtruckohw808.com`，也可以使用：

```env
ORDER_EMAIL_FROM=Xtruck Orders <orders@xtruckohw808.com>
```

设置完成后重新部署 Vercel。可以在 Resend 的 **Emails** 或日志页面检查发送成功、退信和失败原因。

## 7. 登录后台

部署和域名配置完成后：

1. 打开 `https://admin.xtruckohw808.com`。
2. 使用 `ADMIN_USERNAME` 对应的用户名登录。
3. 密码使用生成 Hash 时输入的原始密码，不是 `scrypt$...` Hash。
4. 登录后依次检查：
   - Dashboard
   - Orders
   - Order Detail
   - Email Templates
   - Logout

后台只能编辑履约状态、Shipping Carrier 和 Tracking Number，不能手工修改支付金额或将未支付订单改成 `paid`。

## 8. 邮件模板

后台 **Email Templates** 页面包含：

- `Order Confirmation`
- `Shipping Update`

模板支持以下变量：

```text
{{customer_name}}
{{order_number}}
{{product_name}}
{{quantity}}
{{total}}
{{payment_status}}
{{fulfillment_status}}
{{shipping_carrier}}
{{tracking_number}}
{{order_status_url}}
```

第一版使用普通文本邮件。保存前不要删除变量外侧的双大括号。数据库没有模板时，服务端会使用默认英文内容。

## 9. 完整测试顺序

请先保持 PayPal Sandbox，按以下顺序测试：

1. 在商品页使用 PayPal Sandbox Buyer 完成付款。
2. 确认付款成功页面显示订单号、商品、数量、总额和状态。
3. 在 Supabase `orders` 表确认：
   - `payment_status = paid`
   - PayPal 客户姓名和邮箱已保存
   - `confirmation_email_sent_at` 已填写
4. 在 Resend 确认 Order Confirmation 已成功发送。
5. 点击付款成功页的 **View Order Status**。
6. 使用订单号和 PayPal 下单邮箱查询订单。
7. 登录后台并打开该订单。
8. 将 Fulfillment Status 改为 `shipped`。
9. 填写 Shipping Carrier 和 Tracking Number 后保存。
10. 在 Supabase 确认物流字段和 `shipping_email_sent_at` 已更新。
11. 在 Resend 确认 Shipping Update 已发送。
12. 客户重新查询订单，确认可以看到 Shipped、Carrier 和 Tracking Number。

Sandbox 全流程验证完成前不要切换 PayPal Live。

## 10. 常见问题

### 后台一直提示登录失败

- 确认 `ADMIN_USERNAME` 大小写与输入一致。
- 确认 `ADMIN_PASSWORD_HASH` 是完整的 `scrypt$...`，中间的 `$` 没有丢失。
- 确认 `ADMIN_SESSION_SECRET` 至少 32 个字符。
- 修改变量后确认已经重新部署。

### 订单查询不到

- 必须同时输入正确的 Order Number 和 PayPal 下单邮箱。
- 邮箱应使用 PayPal Capture 返回并保存到订单中的邮箱。
- 查询失败统一显示相同错误，不会提示具体是哪一项错误。

### 付款成功但没有订单确认邮件

- 检查订单是否为 `payment_status = paid`。
- 检查订单是否已有 `customer_email`。
- 检查 `confirmation_email_sent_at` 是否为空。
- 检查 Resend Domain 是否为 Verified。
- 检查 `ORDER_EMAIL_FROM` 是否属于已验证域名。
- 检查 Vercel Function Logs 和 Resend Emails 日志。

邮件发送失败不会把已成功的 PayPal 付款改为失败。

### 保存 Shipped 后没有发货邮件

确认以下条件同时满足：

- Fulfillment Status 为 `shipped`
- Shipping Carrier 已填写
- Tracking Number 已填写
- 订单有 `customer_email`
- `shipping_email_sent_at` 之前为空

## 11. 官方配置参考

- Vercel Custom Domain：<https://vercel.com/docs/domains/set-up-custom-domain>
- Resend Domains：<https://resend.com/docs/dashboard/domains/introduction>
- Resend Send Email API：<https://resend.com/docs/api-reference/emails/send-email>
