import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

//获取领取地址
export function addressList(data) { return get('/pickUpAddress/', data); }

//添加 或 编辑 领取地址
export function addressCreate(data) { return post('/pickUpAddress/', data); }

