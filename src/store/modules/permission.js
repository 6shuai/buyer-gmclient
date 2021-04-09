import { asyncRoutes, constantRoutes } from '@/router'
import router from '@/router'
import Layout from '@/layout'

const moduleMap = {
	'Home': 'home/index',
  'Activity': () => import('@/views/activity/index'),
  'Order': () => import('@/views/order/index'),
  'Member': () => import('@/views/member/index'),
  'Goods': () => import('@/views/material/goods/index'),
  'Banner':() => import('@/views/material/banner/index'),
  'Address': () => import('@/views/material/address/index')
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  removeRoutes: [], // 用于删除动态路由
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_REMOVE_ROUTES: (state, routes) => {
    state.removeRoutes = routes
  },
}

const actions = {
  generateRoutes({ commit }, asyncRouter) {
    return new Promise(resolve => {
      let accessedRoutes = filterAsyncRouter(asyncRouter)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },

  addRoutes({ commit }, accessRoutes) {
    // 添加动态路由，同时保存移除函数，将来如果需要重置路由可以用到它们
    const removeRoutes = []
    accessRoutes.forEach(route => {
      const removeRoute = router.addRoute(route)
      removeRoutes.push(removeRoute)
    })
    commit('SET_REMOVE_ROUTES', removeRoutes)
  },
}


//路由格式化
export const filterAsyncRouter = (data) => {
	let result = [];
	if(!data) return result;
    data.forEach(one => {
        // 先格式化子路由
        let formattedChildren = null;
        if (one.children != null && one.children instanceof Array) {
            formattedChildren = filterAsyncRouter(one.children);
		    }
        let oneRouter = {
            path: one.route, 
            name: one.moduleName, 
            children: formattedChildren || [], 
            // 路由懒加载
            component: one.parentid === 1 ? Layout : moduleMap[one.moduleName],
            meta: {
              title: one.displayName,
              icon: one.moduleName,
            }
        }

      result.push(oneRouter);
	})
    return result;
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
