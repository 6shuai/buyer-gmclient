import { createRouter, createWebHashHistory } from 'vue-router'

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
	roles: ['admin','editor']    control the page roles (you can set multiple roles)
	title: 'title'               the name show in sidebar and breadcrumb (recommend set)
	icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
	noCache: true                if set true, the page will no be cached(default is false)
	affix: true                  if set true, the tag will affix in the tags-view
	breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
	activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
	// {
	//   path: '/redirect',
	//   component: Layout,
	//   hidden: true,
	//   children: [
	//     {
	//       path: '/redirect/:path(.*)',
	//       component: () => import('@/views/redirect/index')
	//     }
	//   ]
	// },
	{
		path: '/redirect',
		component: Layout,
		hidden: true,
		children: [
			{
				path: '/redirect/:path(.*)',
				component: () => import('@/views/redirect/index'),
			},
		],
	},
	{
		path: '/login',
		component: () => import('@/views/login/index'),
		hidden: true,
	},
	// {
	//   path: '/auth-redirect',
	//   component: () => import('@/views/login/auth-redirect'),
	//   hidden: true
	// },
	{
	  path: '/:catchAll(.*)',
	  component: () => import('@/views/error-page/404'),
	  hidden: true
	},
	// {
	//   path: '/401',
	//   component: () => import('@/views/error-page/401'),
	//   hidden: true
	// },
	{
		path: '/',
		component: Layout,
		redirect: '/home',
		children: [
			{
				path: 'home',
				component: () => import('@/views/home/index'),
				name: 'home',
				meta: { title: '首页', icon: 'home' },
			},
		],
	},


	{
		path: '/',
		component: Layout,
		children: [
			// {
			// 	path: '/activity',
			// 	component: () => import('@/views/activity/index'),
			// 	name: 'activity',
			// 	meta: { title: '活动管理', icon: 'guide' },
			// },
			{
				path: '/activity/panicBuy/:id',
				component: () => import('@/views/activity/panicBuy/panicBuy'),
				name: 'activity--panicBuy',
				meta: { title: '抢购管理' },
				hidden: true
			},
			{
				path: '/activity/panicBuy/:id/add',
				component: () => import('@/views/activity/panicBuy/createPanicBuy'),
				name: 'activity--auctionAdd',
				meta: { title: '创建抢购' },
				hidden: true
			},
			{
				path: '/activity/panicBuy/:id/edit/:goodsId',
				component: () => import('@/views/activity/panicBuy/createPanicBuy'),
				name: 'activity--auctionEdit',
				meta: { title: '编辑抢购' },
				hidden: true
			},
			{
				path: '/activity/panicBuy/detail/:id',
				component: () => import('@/views/activity/panicBuy/detail'),
				name: 'activity--auctionDetail',
				meta: { title: '抢购详情' },
				hidden: true
			},
		],
	},



	{
		path: '/',
		component: Layout,
		children: [
			// {
			// 	path: '/order',
			// 	component: () => import('@/views/order/index'),
			// 	name: 'order',
			// 	meta: { title: '订单管理', icon: 'shopping' },
			// },
			{
				path: '/order/detail/:id',
				component: () => import('@/views/order/detail'),
				name: 'order--detail',
				meta: { title: '订单详情' },
				hidden: true
			},
		],
	},

	{
		path: '/',
		component: Layout,
		children: [
			// {
			// 	path: '/material/goods',
			// 	component: () => import('@/views/material/goods/index'),
			// 	name: 'goods',
			// 	meta: { title: '商品管理' }
			// },
			{
				path: '/material/goods/add',
				component: () => import('@/views/material/goods/create'),
				name: 'goods--add',
				meta: { title: '添加商品' },
				hidden: true
			},
			{
				path: '/material/goods/edit/:id',
				component: () => import('@/views/material/goods/create'),
				name: 'goods--edit',
				meta: { title: '编辑商品' },
				hidden: true
			},
			// {
			// 	path: '/material/banner',
			// 	component: () => import('@/views/material/banner/index'),
			// 	name: 'banner',
			// 	meta: { title: 'Banner管理' },
			// },
			{
				path: '/material/banner/add',
				component: () => import('@/views/material/banner/create'),
				name: 'banner--create',
				meta: { title: '创建Banner' },
				hidden: true
			},
			{
				path: '/material/banner/edit/:id',
				component: () => import('@/views/material/banner/create'),
				name: 'banner--edit',
				meta: { title: '编辑Banner' },
				hidden: true
			},
			// {
			// 	path: '/material/location',
			// 	component: () => import('@/views/material/location/index'),
			// 	name: 'Address',
			// 	meta: { title: '领取地址管理' },
			// },
		],
	},

	// {
	// 	path: '/member',
	// 	component: Layout,
	// 	meta: { title: '用户管理', icon: 'user' },
	// 	name: 'member',
	// 	children: [
	// 		{
	// 			path: '/member',
	// 			component: () => import('@/views/member/index'),
	// 			name: 'member',
	// 			meta: { title: '用户管理' }
	// 		}
	// 	]
	// }

	// {
	// 	path: '/',
	// 	component: Layout,
	// 	meta: { title: '财务管理', icon: 'user' },
	// 	name: 'Bill',
	// 	children: [
	// 		{
	// 			path: '/bill',
	// 			component: () => import('@/views/bill/index'),
	// 			name: 'Bill',
	// 			meta: { title: '账单管理', icon: 'Bill' }
	// 		}
	// 	]
	// }

]



/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

]

const router = createRouter({
	// history: createWebHistory(), // require service support
	history: createWebHashHistory(),
	scrollBehavior: () => ({ top: 0 }),
	routes: constantRoutes,
})
export default router