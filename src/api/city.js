import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

//获取所有省
export function placeProvincesData(data) { return get('/area/provinces', data) }

//根据省代码获取市列表
export function placeCitysData(data) { return get(`/area/cities/${data}`) }

//根据市代码获取区县列表
export function placeAreasData(data) { return get(`/area/areas/${data}`) }

//根据区县代码获取省市区数据
export function adcodeFindData(data) { return get(`/area/areaData/${data}`) }