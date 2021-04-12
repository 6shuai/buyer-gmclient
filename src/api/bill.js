import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

//账单列表
export function getBillList(data) { return get('/bill/', data); }
