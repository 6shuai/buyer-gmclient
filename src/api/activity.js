import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

//查看活动列表
export function activityList(data) { return get('/activity/', data); }

//创建活动
export function activityCreate(data) { return post('/activity/', data); }

//查看活动详情
export function activityDetail(data) { return get(`/activity/detail?id=${data}`); }





//获取现有场所所属的城市列表
export function placeCityList(data) { return get('/area/placeOfCity/', data); }

//获取商场列表
export function placeList(data) { return get('/activity/place', data); }

//更新商场列表
export function updatePlaceList(data) { return put('/activity/place', data); }


//商品列表
export function activityGoodsList(data) { return get('/activity/goods', data); }

//商品规格
export function activityGoodsSkuList(data) { return get(`/activity/goodsSku?goodsId=${data}`); }

//商品视频
export function activityGoodsVideoList(data) { return get(`/activity/goodsVideo?goodsSkuId=${data}`); }



//获取领取地址
export function activityAddressList(data) { return get('/activity/pickUpAddress', data); }

//添加 或 编辑 领取地址
export function activityAddressCreate(data) { return post('/activity/pickUpAddress', data); }

//添加领取地址 与 抢购的关联
export function activityAddressCreatePick(data) { return post('/activity/auctionPickUpAddress', data); }

//删除领取地址 与 抢购的关联
export function activityAddressDeletePick(data) { return del(`/activity/auctionPickUpAddress?id=${data}`); }



//获取banner 列表
export function activityGoodsBannerList(data) { return get('/activity/banner', data); }


//添加竞猜规则
export function activityGuessRuleCreate(data) { return post('/activity/guessRule', data); }

//删除竞猜规则
export function activityGuessRuleDelete(data) { return del(`/activity/guessRule?id=${data}`); }


//添加抢购
export function activityPanicBuyCreate(data) { return post('/activity/auction', data); }

//删除抢购
export function activityPanicBuyDelete(data) { return del(`/activity/auction?id=${data}`); }


//查询抢购详情
export function activityPanicBuyDetail(data) { return get(`/activity/auctionDetail?id=${data}`); }


//上/下线抢购
export function activityPanicBuyUpdateState(data) { return put(`/activity/auctionStatus?id=${data.id}&online=${data.online}`); }

