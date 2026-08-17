# Xtruck 支付上线操作清单

代码已经包含以下功能：

- 首页点击 OHW808 跳转到 `/product/ohw808`
- PayPal 在线支付
- PayPal Webhook 验签和订单状态更新
- 香港银行转账申请表
- Supabase 订单和支付事件保存
- 商品详情描述暂时留空

在完成下面的配置前，**不要切换 PayPal Live，也不要向客户宣布在线支付已经可用**。

## 1. 先向老板确认

- [ ] PayPal 是 Business 商家账户，不是个人账户
- [ ] PayPal 账户已经完成身份或企业认证
- [ ] 账户可以接收 USD
- [ ] 已绑定香港银行账户，并确认可以正常提现
- [ ] 商品正式价格确认为 `2399 USD`
- [ ] 是否免运费；当前代码默认运费是 `0 USD`
- [ ] 香港银行转账收款账户名称、银行名称、账号和 SWIFT 信息经过老板确认

银行资料不要写入 GitHub。当前网站只生成银行转账订单，客户需要通过 WhatsApp 获取经过确认的银行资料。

## 2. 创建 Supabase 数据库

1. 登录 <https://supabase.com/> 并创建项目。
2. 在 Supabase 打开 **SQL Editor**。
3. 复制并执行 [`supabase/schema.sql`](./supabase/schema.sql) 的全部内容。
4. 在 **Table Editor** 中确认出现：
   - `orders`
   - `payment_events`
5. 从项目设置中取得：
   - Project URL
   - Service Role Key / Secret Key

Service Role Key 只能放在 Vercel 后端环境变量中，不能发送到客户浏览器，也不能提交到 GitHub。

第一版可以直接用 Supabase Table Editor 作为订单后台：

- `payment_status`：支付状态
- `fulfillment_status`：发货状态
- `tracking_number`：物流单号
- 银行转账确认到账后，人工把 `payment_status` 改为 `paid`

## 3. 创建 PayPal 应用

1. 登录 <https://developer.paypal.com/dashboard/>。
2. 先在 **Sandbox** 创建 App。
3. 保存 Sandbox Client ID 和 Client Secret。
4. 在应用中创建 Webhook，地址填写：

   ```text
   https://www.xtruckohw808.com/api/paypal/webhook
   ```

5. 至少订阅下面的事件：

   ```text
   CHECKOUT.ORDER.APPROVED
   PAYMENT.CAPTURE.COMPLETED
   PAYMENT.CAPTURE.DENIED
   PAYMENT.CAPTURE.REFUNDED
   CUSTOMER.DISPUTE.CREATED
   ```

6. 保存生成的 Webhook ID。

Sandbox 测试完全通过后，再创建或切换到 Live App，替换成 Live Client ID、Client Secret 和 Live Webhook ID。

## 4. 配置 Vercel 环境变量

打开：

```text
Vercel → xtruck-site → Settings → Environment Variables
```

添加以下变量：

```env
VITE_CANONICAL_URL=https://www.xtruckohw808.com/
VITE_PAYPAL_CLIENT_ID=PayPal_Client_ID
VITE_BANK_TRANSFER_ENABLED=false

PAYPAL_CLIENT_ID=PayPal_Client_ID
PAYPAL_CLIENT_SECRET=PayPal_Client_Secret
PAYPAL_WEBHOOK_ID=PayPal_Webhook_ID
PAYPAL_ENV=sandbox

SUPABASE_URL=Supabase_Project_URL
SUPABASE_SERVICE_ROLE_KEY=Supabase_Service_Role_Key

PRODUCT_PRICE_USD=2399
PRODUCT_SHIPPING_USD=0
BANK_TRANSFER_ENABLED=false
WHATSAPP_NUMBER=8613360519239
```

说明：

- `VITE_PAYPAL_CLIENT_ID` 是 PayPal 允许出现在前端的 Client ID。
- `PAYPAL_CLIENT_SECRET`、`PAYPAL_WEBHOOK_ID`、`SUPABASE_SERVICE_ROLE_KEY` 绝对不能以 `VITE_` 开头。
- 银行转账功能确认后，把两个开关都改为 `true`：

  ```env
  VITE_BANK_TRANSFER_ENABLED=true
  BANK_TRANSFER_ENABLED=true
  ```

- 前端价格与后端价格当前均为 `2399 USD`。如果以后修改价格，必须同时修改 `src/data/product.ts` 和 `PRODUCT_PRICE_USD`。

保存环境变量后重新部署 Vercel，否则前端不会读取新的 `VITE_` 配置。

## 5. Sandbox 测试

- [ ] 使用 PayPal Sandbox 买家账号完成支付
- [ ] PayPal 页面显示商品 `Xtruck OHW808`
- [ ] 金额、数量和币种正确
- [ ] PayPal 收集正确的收货地址
- [ ] Supabase `orders` 中出现订单
- [ ] 支付成功后 `payment_status` 变为 `paid`
- [ ] 重复发送 Webhook 不会生成重复订单或重复事件
- [ ] 取消支付不会显示支付成功
- [ ] 手机端 PayPal 按钮、数量选择和 WhatsApp 均正常
- [ ] 银行转账表单能生成 `awaiting_bank_transfer` 订单

## 6. 正式上线

完成 Sandbox 测试后：

1. 将 PayPal 变量替换为 Live App 的值。
2. 将 `PAYPAL_ENV` 改为 `live`。
3. 再次部署 Vercel。
4. 使用真实的小范围订单验证一次。
5. 在 PayPal 和 Supabase 中同时核对订单金额和订单号。

## 7. 上线前仍需补充

- [ ] 商品白底高清图片
- [ ] Product Details 正式英文图文内容
- [ ] Shipping Policy
- [ ] Returns & Refunds Policy
- [ ] Warranty Policy
- [ ] Privacy Policy
- [ ] Terms & Conditions
- [ ] 公司法定名称和正式联系邮箱
- [ ] 明确关税、进口税和国际运费由谁承担

网站不保存银行卡号或 CVV。银行卡和 PayPal 账户资料由 PayPal 处理，本站只保存订单、客户联系方式、收货地址和支付状态。
