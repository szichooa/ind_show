<template>
	<div class="content-views">
		<div class="content-views-body">
			<div class="h1"><h2>“{{loginName}}”您好，欢迎您使用</h2><h1>风机主轴系统优化设计计算平台</h1></div>
			<div class="content">
				<div class="c-t-l c-item" @click="toOperation">
					<p class="menu-cont">
						<i class="iconfont icon-jisuan1"></i>
					</p>
					<div class="menu-bg">业务流程</div>
				</div>
				<div class="c-b-l c-item" @click="toHistory">
					<p class="menu-cont">
						<i class="iconfont icon-lishijilu"></i>
					</p>
					<div class="menu-bg">操作历史</div>
				</div>
				<div class="c-b-r c-item" @click="toAnalysis">
					<p class="menu-cont">
						<i class="iconfont icon-shujukushenji"></i>
					</p>
					<div class="menu-bg">数据分析</div>
				</div>
				<div class="c-t-r c-item" @click="toUsers">
					<p class="menu-cont">
						<i class="iconfont icon-yonghu"></i>
					</p>
					<div class="menu-bg">个人信息</div>
				</div>
			</div>
		</div>
	</div>
		
</template>

<script>
		export default {
			data(){
				return {
					loginName:''
				}
			},
			created(){
				
				this.loginName=window.localStorage.getItem('adminName')
			},
			methods:{
				toUsers(){
					this.$router.push('/users')
				},
				toModel(){
					this.$router.push('/model')
				},
				toAnalysis(){
					this.$router.push('/analysis')
				},
				toOperation(){
					this.$router.push('/operation')
				},
				toHistory(){
					this.$router.push('/history')
				},
			}
		}
</script>

<style lang="scss" scoped>
$menuBgColor:rgba(60,141,188,.8);
$menuBgColorH:rgba(64,158,255,.2);
	.content-views {
		display:flex;
		flex-direction: column;
		height: 100%;
		background: url(../../assets/bg1.jpg) no-repeat;
		background-size: cover;
		.content-views-nav{
			border-bottom: 1px solid #909290;
			flex:0 0 20px;
			line-height:20px;
			padding: 10px 15px 0;
			font-size: 12px;
			.title-view{
				float: left;
				padding-left: 10px;
				font-size: 14px;
				font-weight: 600;
			}
			.mbanav-r{
				float:right;
				.el-breadcrumb{
					height: 20px;
					line-height: 20px;
					font-size: 12px;
				}
			}	
		}
		.content-views-body{
			flex:1;
			position: relative;
			display: flex;
			flex-direction: column;
			.h1{
				flex:1;
				text-align: center;
				line-height:80px;
				width:100%;
				color:#fff;
				text-shadow: 1px 1px 5px #444;
				padding-top:5%;
				h1{
					font-size:46px;
				}
				h2{
					font-size: 30px;
				}
			}
			.content{
				flex:0 0 55%;
				position: relative;
				display: flex;
				min-width:1200px;
				margin:0 auto;
				.c-item{
					flex:1;
					height:260px;
					box-sizing: border-box;
					margin:0 30px 60px;
					background: rgba(0,0,0,.4);
					border-radius:20px;
					color:#eee;
					cursor: pointer;
					.menu-cont{
						height:50%;
						line-height:200%;
						text-align: center;
						i{
							font-size: 70px;
							line-height: 220%;
							color:#ddd;
						}
					}
					.menu-bg{
						text-align: center;
						line-height: 100px;
						font-size: 36px;
					}
				}
				.c-item:hover{
					background: rgba(0,0,0,.6);
					.menu-cont{
						text-align: center;
						i{
							text-shadow: 1px 1px 5px #444;
							color:#ddd;
						}
					}
					.menu-bg{
						text-shadow: 1px 1px 5px #444;
						text-align: center;
						font-size: 36px;
					}
				}
				
			}
		}
	}
	
</style>