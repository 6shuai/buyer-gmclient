import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

//添加领取地址
export function locationCreate(data) { return post('/location/', data); }

//领取地址列表
export function locationList(data) { return get('/location/', data); }
