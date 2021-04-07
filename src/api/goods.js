import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

//添加商品
export function goodsCreate(data) { return post('/goods/', data); }

//商品列表
export function goodsList(data) { return get('/goods/', data); }

//商品详情
export function goodsDetail(data) { return get(`/goods/detail?id=${data}`); }
