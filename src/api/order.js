import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

//订单状态
export function orderStatusList(data) { return get('/order/status', data); }

//订单列表
export function orderList(data) { return get('/order/', data); }

//订单详情
export function orderDetail(data) { return get(`/order/detail?id=${data}`); }

//获取快递公司列表
export function expressCompanyList(data) { return get('/order/expressCompany', data); }

//发货
export function orderExpress(data) { return put('/order/', data); }