import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

//首页登录
export function userLogin(data) { return postKeyValueRequest('/sign_in', data); }

//退出登录
export function userLogout(data) { return get('/logout', data); }


//获取菜单列表
export function getAuthMenu(data) { return get('/user/authority', data); }


//用户列表
export function getMemberList(data) { return get('/user/', data); }

