import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Login from "../pages/login"
import Home from "../pages/home"

import Indexx from "../pages/manage/index"
import Operation from "../pages/manage/operation"
import Users from "../pages/manage/users"
import History from "../pages/manage/history"
import Hisblank from "../pages/manage/hisblank"
import Analysis from "../pages/manage/analysis"
import Localdb from "../pages/manage/localdb"

export default new Router({
	routes: [  
		{
			path:"/",
			component:Home,
			children:[
				{
					path:"/",
					component:Indexx,
					// meta:["首页"]
					meta:{auth: true}
				},
				{
					path:"/index",
					component:Indexx,
					meta:{auth: true}
				},
				{
					path:"/history",
					component:History,
					// meta:["历史查询"]
					meta:{auth: true}
				},
				{
					path:"/hisblank",
					component:Hisblank,
					// meta:["历史查询"]
					meta:{auth: true}
				},
				{
					path:"/users",
					component:Users,
					// meta:["个人信息"],
					meta:{auth: true},
					children:[]
				},
				{
					path:"/analysis",
					component:Analysis,
					// meta:["数据分析"],
					meta:{auth: true},
					children:[]
				},
				{
					path:"/localdb",
					component:Localdb,
					// meta:["数据分析"],
					meta:{auth: true},
					children:[]
				},
				{
					path:"/operation",
					component:Operation,
					// meta:["业务计算"]
					meta:{auth: true}
				}
			]
		},
		{
			path:"/home",
			component:Home,
		},
		{
			path:"/login",
			component:Login,
			meta:["登录"]
			},
		{
			path:"*",
			redirect:"/"
		}
			
	]
})
