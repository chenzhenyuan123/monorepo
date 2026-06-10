// 页面各类状态枚举
export const ordersStatus = [{
  label: 'orders.ordersStatus1', value: 0, tag: 'primary' // 待付款
}, {
  label: 'orders.ordersStatus2', value: 1, tag: 'primary' // 待发货
}, {
  label: 'orders.ordersStatus3', value: 2, tag: 'warning' // 已发货
}, {
  label: 'orders.ordersStatus4', value: 3, tag: 'success' // 已完成
}, {
  label: 'orders.ordersStatus5', value: 4, tag: 'info' // 已取消
}]
// 退款状态枚举
export const refundStatus = [{
  label: 'orders.refundStatus', value: 1, tag: 'primary' // 有退款
}]