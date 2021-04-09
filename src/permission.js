import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
	// start progress bar
	NProgress.start()

	// set page title
	document.title = getPageTitle(to.meta.title)
	const hasToken = getToken()
	if (hasToken) {
		if (to.path === '/login' || to.path === '/register') {
			next({ path: '/' })
			NProgress.done()
		}else {
			if(!store.state.permission.addRoutes.length){
				const { obj } = await store.dispatch('user/getMenuList')

				const accessRoutes = await store.dispatch('permission/generateRoutes', obj)

				
				store.dispatch('permission/addRoutes', accessRoutes)

				next({ ...to, replace: true })

			}else{
				next()
			}
		}
	} else {

		if (whiteList.indexOf(to.path) !== -1) {
			// 在免登录白名单，直接进入
			next()
		} else {
			// other pages that do not have permission to access are redirected to the login page.
			next({ path: '/login' })
			NProgress.done()
		}
	}
	
})

router.afterEach(() => {
	// finish progress bar
	NProgress.done()
})



