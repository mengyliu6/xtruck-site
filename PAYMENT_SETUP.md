# Xtruck OHW808 PayPal 支付配置说明

当前项目只实现 **PayPal Orders v2**，不包含其他付款方式。第一阶段必须使用 PayPal Sandbox，完成全部测试前不要切换到 Live。

## 1. 创建 Supabase 项目

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)。
2. 创建一个新项目并选择合适的区域。
3. 等待数据库初始化完成。
4. 在 Project Settings 中记录 Project URL。
5. 在 API Keys 中创建或取得新版 Secret Key，值应以 `sb_secret_` 开头。

`SUPABASE_SECRET_KEY` 拥有高权限，只能放在 Vercel Functions 环境变量中。不要使用旧版 `service_role` Key，也不要把 Secret Key 放到 `VITE_` 变量、前端代码、GitHub、截图或聊天消息中。

## 2. 执行数据库 Schema

1. 打开 Supabase 项目的 SQL Editor。
2. 新建查询。
3. 打开项目中的 `supabase/schema.sql`，复制完整 SQL 到编辑器。
4. 点击 Run。
5. 在 Table Editor 中确认已创建 `orders` 和 `payment_events`。

Schema 使用整数美分保存金额，开启 RLS，并且没有为 `anon` 或 `authenticated` 创建读取订单的策略。所有订单读写都由持有新版 Supabase Secret Key 的 Vercel Functions 完成。

## 3. 确认 PayPal Business 账户状态

正式上线前，登录 PayPal 商家后台并确认：

1. 账户类型是 Business。
2. 邮箱和商家身份已按 PayPal 要求完成验证。
3. 账户没有限制收款的提示。
4. 钱包可以接收并持有 USD，或已配置 USD 自动换汇规则。

账户验证与 USD 收款能力由 PayPal 决定。如有地区或账户限制，应在 PayPal 商家后台或官方客服处确认。

## 4. 创建 PayPal Sandbox App

1. 登录 [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)。
2. 进入 Apps & Credentials。
3. 选择 **Sandbox**，不要选择 Live。
4. 创建 REST App，例如 `Xtruck OHW808 Sandbox`。
5. 选择一个 Sandbox Business 商家账户作为收款方。
6. 保存后记录 Sandbox Client ID 和 Secret。

浏览器只使用 Client ID。Secret 只允许用于服务端。

## 5. 创建 PayPal Webhook

在 Sandbox App 的 Webhooks 区域添加：

`https://www.xtruckohw808.com/api/paypal/webhook`

建议订阅：

- `CHECKOUT.ORDER.APPROVED`
- `PAYMENT.CAPTURE.COMPLETED`
- `PAYMENT.CAPTURE.DENIED`
- `PAYMENT.CAPTURE.REFUNDED`
- `CUSTOMER.DISPUTE.CREATED`

保存后复制 Webhook ID，配置为 `PAYPAL_WEBHOOK_ID`。Sandbox 与 Live 的 Webhook ID 不通用。

## 6. 配置 Vercel 环境变量

在 Vercel 项目的 Settings > Environment Variables 中添加：

| 变量                    | 范围         | 说明                                  |
| ----------------------- | ------------ | ------------------------------------- |
| `VITE_CANONICAL_URL`    | 前端公开     | `https://www.xtruckohw808.com/`       |
| `VITE_PAYPAL_CLIENT_ID` | 前端公开     | Sandbox Client ID                     |
| `PAYPAL_CLIENT_ID`      | 仅服务端     | Sandbox Client ID                     |
| `PAYPAL_CLIENT_SECRET`  | 仅服务端机密 | Sandbox Secret                        |
| `PAYPAL_WEBHOOK_ID`     | 仅服务端     | Sandbox Webhook ID                    |
| `PAYPAL_ENV`            | 仅服务端     | 第一阶段填写 `sandbox`                |
| `SUPABASE_URL`          | 仅服务端     | Supabase Project URL                  |
| `SUPABASE_SECRET_KEY`   | 仅服务端机密 | 新版 Secret Key，以 `sb_secret_` 开头 |
| `PRODUCT_PRICE_USD`     | 仅服务端     | `2399`                                |
| `PRODUCT_SHIPPING_USD`  | 仅服务端     | 当前填写 `0`                          |
| `WHATSAPP_NUMBER`       | 仅服务端预留 | 联系号码，不影响 PayPal 流程          |

变量名以 `VITE_` 开头时会进入浏览器构建结果，所以绝对不要把 PayPal Secret 或 Supabase Secret Key 加上 `VITE_` 前缀。

环境变量没有配置完整时，商品页会显示 `PayPal setup required`，不会显示伪造的可支付按钮，也不会模拟支付成功。

## 7. 进行 Sandbox 测试付款

1. 在 PayPal Developer Dashboard 的 Sandbox Accounts 中创建或选择 Personal 买家测试账户。
2. 确保买家测试账户有足够的 Sandbox 余额。
3. 部署 Vercel Preview，并打开 `/product/ohw808`。
4. 数量选择 1 到 5。
5. 点击 PayPal 按钮，使用 Sandbox Personal 买家账号登录。
6. 核对 PayPal 窗口中的币种、单价、数量和总额后批准。
7. 页面应显示支付成功或等待处理状态，不应在批准前显示成功。

不要使用真实 PayPal 密码测试 Sandbox，也不要使用商家 Sandbox 账户作为买家给自己付款。

## 8. 确认 Capture 成功

1. 在浏览器 Network 中确认 `/api/paypal/capture-order` 返回 200。
2. 返回内容中的 `paymentStatus` 应为 `paid`。
3. 在 PayPal Developer Dashboard 查看 Sandbox 交易。
4. 在 Supabase `orders` 表中确认：
   - `payment_status = paid`
   - `currency = USD`
   - `total_amount` 等于服务端计算的整数美分金额
   - `paypal_order_id` 和 `paypal_capture_id` 已填写
5. 如果金额、币种、SKU、数量或订单关联不一致，系统会把订单标记为 `review`，不能当作已付款订单发货。

## 9. 检查 Webhook

1. 在 PayPal App 的 Webhook 页面查看 Delivery/Event 日志。
2. 确认生产域名接口返回 HTTP 200。
3. 在 Supabase `payment_events` 表查找对应 `provider_event_id`。
4. `processed_at` 有值代表处理完成。
5. 同一个 Event ID 再次发送时不会重复入账；唯一约束和服务端事件认领逻辑会把它识别为重复事件。

PayPal Webhook Simulator 的模拟事件不属于真实 App。签名验证测试应按照 PayPal 对模拟 Webhook 的说明执行，真实 Sandbox 付款仍需使用 Sandbox App 的实际 Webhook ID。

## 10. 失败订单与重复事件

- `pending`：订单已创建但尚未完成支付。
- `approved`：买家已批准，Capture 仍在处理。
- `paid`：Capture 完成且金额、币种和订单信息完全一致。
- `failed`：PayPal 拒绝或 Capture 失败。
- `review`：金额、币种、SKU、数量或订单关联不一致，需要人工检查。
- `refunded`：收到退款事件。

Capture 使用稳定的 PayPal Request ID，并在数据库中检测已付款订单，因此重复调用不会重复收款。Webhook 使用 PayPal Event ID 唯一约束；处理失败时会释放事件认领，让 PayPal 后续重试。

不要手动把失败、待处理或 review 订单改成 paid。应先在 PayPal Dashboard 核对真实 Capture。

## 11. 从 Sandbox 切换到 Live

只有完整完成 Sandbox 下单、批准、Capture、数据库写入和 Webhook 测试后，才能切换：

1. 确认 PayPal Business 账户已验证且可接收 USD。
2. 在 PayPal Developer Dashboard 创建或启用 Live App。
3. 为 Live App 创建相同事件类型的正式 Webhook。
4. 在 Vercel 中把前后端 Client ID 都替换为 Live Client ID。
5. 替换 `PAYPAL_CLIENT_SECRET` 和 `PAYPAL_WEBHOOK_ID` 为 Live 值。
6. 将 `PAYPAL_ENV` 改为 `live`。
7. 重新部署 Vercel。
8. 使用一笔受控的小额真实订单完成上线验证，并在 PayPal 与 Supabase 双方核对。

Sandbox 和 Live 凭据不能混用。切换时不要把真实 Secret 写入 `.env.example` 或提交到 GitHub。

## 12. 修改环境变量后重新部署

Vite 的 `VITE_PAYPAL_CLIENT_ID` 是构建时变量。修改任何支付环境变量后：

1. 在 Vercel 保存变量。
2. 确认变量应用到 Preview 或 Production 的正确环境。
3. 从 Deployments 页面选择 Redeploy，或推送新的提交触发部署。
4. 部署完成后重新打开页面，不要只刷新旧的构建缓存。

## 13. 上线前价格和运费检查

当前服务端默认：

- 商品单价：`PRODUCT_PRICE_USD=2399`
- 运费：`PRODUCT_SHIPPING_USD=0`
- 币种：USD
- 数量：1–5

上线前由负责人再次确认价格与运费。服务端会重新计算金额，不信任前端提交的金额。修改价格或运费后必须重新部署，并重新完成 Sandbox 回归测试。

## 14. 上线前政策准备

正式收款前，应准备并在网站提供适合实际销售地区的：

1. 退款与退货政策。
2. 隐私政策，包括 PayPal 和订单数据的处理说明。
3. 运输地区、费用、时效、关税和签收规则。
4. 产品服务条款、保修范围和售后流程。
5. 商家主体、联系邮箱和有效客服渠道。

必要时请让熟悉目标市场的法律或合规专业人士审核。

## 安全提醒

- Sandbox 测试完成前不要切换到 Live。
- 不要把 PayPal Client Secret 提交到 GitHub。
- 不要把 Supabase Secret Key 放到前端。
- 不要通过聊天发送真实 Secret。
- 网站不收集或保存银行卡号、信用卡号、有效期或 CVV；付款信息由 PayPal 托管处理。
- 当前项目只实现 PayPal，不包含银行转账。
