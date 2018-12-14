<template>
	<div id="content">
		<div id="header">
			<div class="l">
				<h1 @click="backHome()">	
					<img src="../assets/logo.png"/>				
					<p class="title-logo">风机主轴系统优化设计计算平台</p>					
				</h1>
			</div>
			<div class="r">
				<ul class="nav-menu">
					<router-link to="/index" tag="li" class="nav-menu-list" active-class="active"><i class="iconfont icon-zhuye1"></i>首页</router-link>
					<router-link to="/operation" tag="li" class="nav-menu-list" active-class="active"><i class="iconfont icon-jisuan1"></i>业务流程</router-link>
					<router-link to="/history" tag="li" class="nav-menu-list" active-class="active"><i class="iconfont icon-lishijilu"></i>历史记录</router-link>
					<router-link to="/analysis" tag="li" class="nav-menu-list" active-class="active"><i class="iconfont icon-shujukushenji"></i>数据分析</router-link>
					<router-link to="/users" tag="li" class="nav-menu-list" active-class="active"><i class="iconfont icon-yonghu"></i>个人信息</router-link>
					<li class="nav-menu-list" active-class="active" @click="toLogin"><i class="iconfont icon-ZHicon-"></i>退出登录</li>
				</ul>
			</div>
		</div>
		<div id="views" class="content-views"><router-view></router-view></div>
	</div>

</template>

<script>
	export default {
		data() {
			return {
				userManagement:true,
				navWidth:'width:200px;',
				adminName:'',
				isCollapse: false,
				isShow:true
			};
		},
		methods: {
			backLogin(){

			},
			isShowNAv(){
				if(this.navWidth==="width:200px;"){
					return this.navWidth='width:0px;'
				}else{
					this.navWidth="width:200px;"
				}	
			},
			toLogin(){
				window.localStorage.clear();
				window.sessionStorage.setItem('isLogin','0');
				this.$router.push('/login'); 
			},
			toUsers(){
				this.$router.push('/users');   
			},
			toFnc(){
				this.$router.push('/fnc');   
			},
			toModel(){
				this.$router.push('/model');   
			},
			backHome(){
				this.$router.push('/index')
			},
			toEditAdminUser(){
				let adminId=window.localStorage.getItem('adminId')
				window.localStorage.setItem('statusDisabled',"0")
				ichooarouter.push('/users/createuser/' + adminId)
			}
		},
		mounted(){
			this.adminName=window.localStorage.getItem('adminName')
			let isAdminID=Boolean(parseInt(window.localStorage.getItem('isAdminId')))
			this.userManagement=isAdminID
		},
		computed: {
			defaultActive: function() {
				return this.$route.path.replace('/', '');
			}
		}
	
	}
</script>

<style type="text/css" lang="scss" scoped>
$headsize : 80px;
#content{
	height:100%;
	display: flex;
	flex-direction: column;
	#header {
		flex:0 0 $headsize;
		z-index: 800;
		height: $headsize;
		width: 100%;
		min-width:600px;
		background: #3c8dbc;
		min-width: 1000px;
		.l {
			height: $headsize;
			line-height: $headsize;
			width: 380px;
			h1 {
				z-index: 801;
				color: #fff;
				width: 360px;
				float: left;
				height: $headsize;
				line-height: $headsize;	
				text-align: left;
				text-indent: 1em;
				font-size: 18px;
				img{
					float: left;
					height:40px;
					margin-top:20px;
					margin-left:10px;
					cursor: auto;
				}
				.title-logo{
					float: left;
					width: 280px;
					height: $headsize;
					line-height: $headsize;
					cursor: auto;
				}
			}
			.btn-nav{
				cursor: pointer;
				float:left;
				color: #fff;
				text-align: left;
				text-indent: 20px;
				height: $headsize;
				line-height: $headsize;
				width: 70px;
				font-size: 18px;
				
			}
			
		}
		.r {
			height: $headsize;
			line-height: $headsize;
			text-align: right;
			.nav-menu{
				float:right;
				height: $headsize;
				line-height: $headsize;
				
				li{
					font-size: 12px;
					transition: all .2s linear 0s;
					width:120px;
					float:left;
					color:#eee;
					cursor:pointer;
					height:$headsize;
					line-height: 120px;
					text-align: center;
					position: relative;
					margin-left:1px;
					i{
						transition: font-size .2s linear 0s;
						height:36px;
						line-height: 36px;
						font-size: 26px;
						position: absolute;
						width:100%;
						left:0;
						top:13px;
					}
				}
				li::before{
					content: '';
					position: absolute;
					left:-1px;
					width:1px;
					height:100%;
					background: linear-gradient(to bottom,#3c8dbc 10%, #bbb 50%,#3c8dbc 90%);
				}
				// li:first-child::before{
				// 	content: '';
				// 	display: none;
				// }
				li:hover{
					text-shadow: 1px 1px 5px #444;
					color:#fff;
					font-size: 14px;
					background: #367fa9;
					i{
						font-size: 30px;
					}
				}
				.active{
					background: #367fa9;
					text-shadow: 1px 1px 5px #444;
					color:#fff;
					font-size: 14px;
					i{
						font-size: 30px;
					}
				}
			}
		}
	}
	#views{
		flex:1;
		overflow-y: auto;
	}
}	
	.bounce-enter-active {
	  	animation: bounce-in .5s linear;
	}
	.bounce-leave-active {
	 	animation: bounce-in .5s linear;
	}
	@keyframes bounce-in {
		0% {
			width: 0;
			transform:translateX(-100%);
			opacity: 0;
		}
		100% {
			width:200px;
			transform:translateX(0px);
			opacity: 1;
		}
	}
</style>