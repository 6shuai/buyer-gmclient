import axios from 'axios';
import { MessageBox, ElMessage } from 'element-plus';
import qs from 'qs';
import store from '../store';
import router from '@/router';

const ajaxUrl = process.env.NODE_ENV === 'development'
	? '/' : `${document.location.origin}/`;   
axios.defaults.timeout = 60000;   
axios.defaults.baseURL = ajaxUrl;    //设置请求域名 
axios.defaults.withCredentials = true;  //携带cookie

// request i
axios.interceptors.request.use(
	(config) => {
		// config.headers = {
		// 	'Content-Type': 'application/x-www-form-urlencoded'
		// };

		return config;
	},
	(error) => {
		console.log(error); // for debug
		return Promise.reject(error);
	}
);

/**
 * 响应拦截器
 * code 4    账号的时效期 过期
 * code 103  无权限访问
 */
axios.interceptors.response.use(
	(response) => {
		const res = response.data;
		if (res.code !== 0) {
			ElMessage.closeAll()
			if(res.code === 4){
				logout();
			}else if(res.code === 103){
				if(response.config.url == '/user/authority'){
					logout();
				}else if(location.hash != '#/'){
					router.push({ path: '/' });
				}
			}
			ElMessage.error({message: res.message});
			// return new Promise(() => {});
			return res
		}else{
			return res
		}
	},
	(error) => {
		ElMessage.closeAll();
		switch (error.response.status) {
			case 504:
			case 404:
				ElMessage.error({message: '服务器被吃了( ╯□╰ )'});
				break;
			case 403:
				ElMessage.error({
					message: '权限不足，请联系管理员',
					onClose: () => {
						if(location.hash != '#/' && location.hash != '#/login'){
							router.push({ path: '/' })
						}
					}
				});
				
				break;
			case 401:
				ElMessage.error({message: '尚未登录，请登录'});
				router.push({ path: '/login' })
				break;
			default:
				ElMessage.error({message: 'error'});
				break;
		}
		return Promise.reject(error);
	}
);


//退出登录
const logout = function(){
	store.dispatch('user/logout').then(() => {
		location.reload() // 为了重新实例化vue-router对象 避免bug
	})
}

/**
 * get 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
		.then(response => {
			resolve(response);
		})
		.catch(err => {
			reject(err)
		})
    })
}

/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
    })
}

/**
 * postKeyValueRequest 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function postKeyValueRequest(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(data), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
    })
}



/**
 * delete 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function del(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {data:qs.stringify(data)})
        .then(response => {
            resolve(response);
        }, err => {
            reject(err);
        })
    })
}

/**
 * patch 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
    })
}

/**
 * put 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
    })
}

