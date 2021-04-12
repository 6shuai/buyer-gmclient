import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

//添加banner
export function bannerCreate(data) { return post('/banner/', data); }

//banner 列表
export function bannerList(data) { return get('/banner/', data); }

//banner 详情
export function bannerDetail(data) { return get(`/banner/detail?id=${data}`); }

//banner 删除
export function bannerDelete(data) { return del(`/banner/?id=${data}`); }

//banner 查询抢购数据
export function bannerPanicBuyList(data) { return get('/banner/auction', data); }
