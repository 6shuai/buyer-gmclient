import { asyncRoutes, constantRoutes } from '@/router'
import router from '@/router'

const moduleMap = {
	'Home': 'home/index',
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
    commit('SET_ROUTES', asyncRouter)
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
        component: one.parentID === 1 ? Layout : (resolve) => require(['@/views/' + moduleMap[one.moduleName] + '.vue'], resolve),
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
