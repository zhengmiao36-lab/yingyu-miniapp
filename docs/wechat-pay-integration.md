# 微信支付与线下核销接入说明

当前工程默认使用 `config/payment.js` 中的 `demo` 模式，只生成本地演示订单，不会扣款。真实微信支付必须由可信后端发起，小程序前端不能保存商户私钥，也不能自行决定订单金额、库存或支付状态。

## 1. 商户准备

1. 完成小程序主体认证，并确认服务类目可以销售演出票和门店商品。
2. 开通微信支付商户号，在商户平台将小程序 AppID `wx8994a5c8beccc17c` 与商户号绑定。
3. 在服务端配置商户号、API v3 密钥、商户证书序列号和商户私钥。
4. 配置已备案的 HTTPS API 域名，并在小程序后台加入 `request` 合法域名；核销二维码图片域名还需加入 `downloadFile` 合法域名。
5. 服务端优先使用微信支付官方 Java、PHP、Go 或 Node SDK，避免自行实现签名和回调解密。

## 2. 创建支付接口

小程序已预留以下接口：

```text
POST /api/payments/wechat/miniapp/create
Authorization: Bearer <登录令牌>
Content-Type: application/json
```

请求示例：

```json
{
  "clientRequestId": "miniapp-1785686400000-12345",
  "orderType": "ticket",
  "itemId": "show-8.2-14:00-17:30",
  "actorId": "shen-yan",
  "performanceDate": "8.2",
  "performanceTime": "14:00-17:30",
  "quantity": 1
}
```

后端必须根据 `itemId` 重新查询价格、库存、场次和购买限制，创建待支付订单，再调用微信支付 API v3 的 JSAPI/小程序下单接口。不要接收或相信前端上传的金额。

成功响应：

```json
{
  "data": {
    "orderId": "YY202608021930001234",
    "timeStamp": "1785686400",
    "nonceStr": "server-generated-nonce",
    "package": "prepay_id=wx201410272009395522657a690389285100",
    "signType": "RSA",
    "paySign": "server-generated-signature"
  }
}
```

前端会把这些字段直接交给 `wx.requestPayment`。正式 API 可用后，将 `config/payment.js` 改为：

```js
module.exports = {
  mode: 'wechat',
  apiBaseUrl: 'https://api.example.com'
};
```

## 3. 支付结果与订单查询

不要把 `wx.requestPayment` 的成功回调当作最终入账依据。后端必须：

1. 接收微信支付 API v3 支付通知，校验通知签名并解密回调数据。
2. 校验 AppID、商户号、订单号、金额和币种。
3. 以微信支付交易号做幂等处理，将订单从 `pending` 原子更新为 `paid`。
4. 支付成功后扣减或锁定库存，生成核销凭证。
5. 提供订单查询接口：

```text
GET /api/orders/:orderId
Authorization: Bearer <登录令牌>
```

响应字段需至少包含：

```json
{
  "data": {
    "id": "YY202608021930001234",
    "orderNo": "YY202608021930001234",
    "status": "paid",
    "statusText": "待核销",
    "verificationCode": "58310427",
    "verificationQrUrl": "https://api.example.com/vouchers/temporary-token.png"
  }
}
```

## 4. 线下核销方案

顾客订单详情页同时支持动态二维码和 8 位数字核销码。建议正式环境采用：

- 二维码内容只放短时有效、一次性的签名 token，不要直接暴露订单号或用户信息。
- 工作人员使用门店核销端扫码；无法扫码时，可人工输入 8 位核销码。
- 核销端必须先登录并具备指定门店权限。
- 服务端在事务中执行 `paid -> redeemed` 状态更新，并记录门店、操作员、设备和核销时间。
- 已核销、已退款、已过期或门店不匹配时明确拒绝，避免重复核销。
- 商品和演出票分别设置有效期；票务凭证应在对应场次和允许入场时间段内有效。

建议核销接口：

```text
POST /api/store-verifications/redeem
Authorization: Bearer <员工令牌>

{
  "token": "二维码中的短时 token",
  "storeId": "store-shanghai-01"
}
```

人工码核销时将 `token` 换成 `verificationCode`，后端仍需执行相同的权限、状态和幂等检查。

## 5. 上线前检查

- 支付、取消、重复点击、超时、库存不足和回调重放均有测试。
- 使用服务端幂等键处理同一 `clientRequestId`，避免重复建单。
- 退款只能由后端调用微信退款接口，并同步使未使用凭证失效。
- 日志中不记录商户私钥、完整用户令牌、支付签名或核销 token。
- 体验版和正式版分别使用独立配置，发布前确认 `mode` 已切换且合法域名已配置。
