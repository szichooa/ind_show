import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);//注册模块

const store = new Vuex.Store({
	state:{
		adminLoginname:"",
		adminToken:"",
		tableShowData:{},
		tableShowData1:{},
		funDataParaID:'',
		changeTableDataShow:[],
		loaclDBTh:[],
		localDBList:[],
		comDBTh:[],
		comDBList:[]
	},

	actions:{
		
//		getCommingsoonList(store){
//			axios.get("/v4/api/film/coming-soon?page=1&count=7").then(res=>{
//				console.log(res.data);
//
//				store.commit("getCommingsoonListMutation",res.data.data.films);
//			})
//		}
	},

	mutations:{
		changeLoaclDBTh(state,data){
			state.loaclDBTh=data
		},
		changeLoaclDBList(state,data){
			state.localDBList=data
		},
		changeComDBTh(state,data){
			state.comDBTh=data
		},
		changeComDBList(state,data){
			state.comDBList=data
		},
		changeTableDataShowNow(state,data){
			state.changeTableDataShow=data
		},
		comTableShowData(state,data){
			state.tableShowData=data
		},
		comTableShowData1(state,data){
			state.tableShowData1=data
		},
		myChangeAdminToken(state,payload){
			//接受commit 提交来的数据
			state.adminLoginname=payload.loginName;
			state.adminToken = payload.userToken;
		},
		myChangeEditForm(state,form){
			state.editUserToken=form.userToken;
			state.editUser = form;
		},
		myChangefncTitle(state,title){
			state.fncTitle=title
		},
		myChangeFunDataParaID(state,funid){
			state.funDataParaID=funid
		},
		myChangeFncNameD(state,fnc){
			state.fncNameD=fnc
		}
	}
})
//store 一个“全局对象”

export default store;