import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '*',
		name: 'Error',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/Error.vue')
	}
]

const router = new VueRouter({
	mode: 'history',
	base: '/MyResumeDemo_v20/dist/',
	routes
})

// router.beforeEach((to, from, next) => {
// 	console.log('to', to)
// 	console.log('from', from)
// 	next()
// })

export default router
