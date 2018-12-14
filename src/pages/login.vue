<template>
	<div class="heig login-bg">	
		<transition name="bounce">			
		<div class="form" v-show="isShow" v-loading="loading">	 
			<h1>风机主轴系统优化设计计算平台</h1>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
				<el-form-item prop="login_name" style="position:relative;padding-left:120px;">
					<i class="iconfont icon-yonghu" style="position:absolute;left:-40px;font-size:30px;color:#ddd;"></i>
					<input type="text" class="input-value" v-model:value="ruleForm.login_name" placeholder="用户名" @keyup.enter="submitForm('ruleForm')">
				</el-form-item>
				<el-form-item prop="login_pwd" label-width="0px" style="position:relative;padding-left:120px;">
					<i class="iconfont icon-mima3" style="position:absolute;left:-40px;font-size:30px;color:#ddd;"></i>
					<input type="password" class="input-value" v-model:value="ruleForm.login_pwd" placeholder="密码" @keyup.enter="submitForm('ruleForm')">
				</el-form-item>
				<el-form-item prop="login_pwd" label-width="0px" style="position:relative;padding-left:120px;margin-bottom:5px;">
				<el-checkbox v-model="isChecked" style="color:#ddd;">记住登录状态</el-checkbox></el-form-item>
				<el-form-item style="">
					<div class="logbtn" @click="submitForm('ruleForm')">登陆</div>
					<div class="resbtn" @click="resetForm('ruleForm')">重置</div>
				</el-form-item>
			</el-form>
		</div>
		</transition>
	</div>

</template>

<script>
	import axios from "axios";
	import { requestLogin } from '../api/api';
	export default {
		mounted(){
			if(window.localStorage.getItem('isLogin')){
				this.isChecked=Boolean(parseInt(window.localStorage.getItem('isLogin')));
				if(this.isChecked){
					this.$router.push('/index')
				}else{
					let localLoginName=window.localStorage.getItem('loginName')
					this.ruleForm.login_name=localLoginName
					window.localStorage.clear()
					window.localStorage.setItem('isLogin','0')
					window.sessionStorage.setItem('isLogin','0')
				}
			}
			this.isShow=true
			this.ruleForm.login_name=window.localStorage.getItem('loginName')
			window.localStorage.clear()
		},
		data() {
			
			return {
				isChecked: false,
				loading:false,
				isShow:false,
				ruleForm: {
					login_name: '',
					login_pwd: ''
				},
				rules: {
					required: true,
					login_name: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 5,
							max: 11,
							message: '长度在5 到 11 个字符',
							trigger: 'blur'
						}
					],
					login_pwd: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 14,
							message: '长度在6 到 14 个字符',
							trigger: 'blur'
						}
					]
				}
			};
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading=true;
						var params = new URLSearchParams();
						params.append('login_name', this.ruleForm.login_name);
						params.append('login_pwd',this.ruleForm.login_pwd);
						requestLogin(window.sessionStorage.ApiUrl,params).then((res)=>{
							if(res.data.status==200){	
								this.$store.commit('myChangeAdminToken',res.data.data)
								window.localStorage.setItem('adminToken',res.data.data.userToken)
								window.localStorage.setItem('adminName',res.data.data.userName)
								window.localStorage.setItem('loginName',res.data.data.loginName)
								window.localStorage.setItem('adminId',res.data.data.id)
								window.localStorage.setItem('adminPhone',res.data.data.userPhone)
								window.localStorage.setItem('isAdminId',res.data.data.isAdmin)
								if(this.isChecked){
									window.localStorage.setItem('isLogin','1')
									window.sessionStorage.setItem('isLogin','1')
									this.$router.push('/index')
								}else{
									window.localStorage.setItem('isLogin','0')
									window.sessionStorage.setItem('isLogin','1')
									this.$router.push('/index')
								}
							}else if(res.data.status==300){
								this.$message.error({
									message: '用户名或密码错误',
									showClose: false
								});
								this.loading=false;
							}else if(res.data.status==400){
								this.$message.error({
									message: '用户名或密码错误',
									showClose: false
								});
								this.loading=false;
							}else if(res.data.status==500){
								this.$message.error({
									message: '请检查网络链接',
									showClose: false
								});
								this.loading=false;
							}else{
								this.$message.error({
									message: '请检查网络',
									showClose: false
								});
								this.loading=false;
							}
						}).catch(err => {
							this.$message.error({
								message: '请检查网络',
								showClose: false
							});
							this.loading=false;
						})
					} else {
						this.$message.error({
					    	message: '用户名或密码不规范',
					    	showClose: false
					    });
					}
				});	
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-bg {
		height: 100%;		
		background: url(../assets/bg1.jpg) no-repeat;
		background-size:cover;
		.form::before {
			position: absolute;
			background: rgba(102, 101, 101, 0.3);
			background-size: cover;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background-position: center center;
			content: '';
			filter: blur(20px);
			/*    background: rgba(225, 0, 0, 0.5);*/
		}
		.form {
			height: 430px;
			width: 800px;
			position: fixed;
			top: 10%;
			left: 50%;
			margin-top: 120px;
			margin-left: -400px;
			overflow: hidden;
			border-radius: 8px;
			background-color: rgba(255,255,255,.2);
			
			h1{
				position: relative;
				padding-top:60px;
				height:100px;
				text-align: center;
				color:#eee;
				font-size:32px;
				z-index:200;
			}
			.demo-ruleForm{
				padding:0 120px;
				.input-value{
					display:block;
					background: rgba(0,0,0,.1);
					border-bottom:1px solid #ccc;
					height:40px;
					line-height:40px;
					font-size: 14px;
					color:#fff;
					margin:0 100px 0 0px;
					width:230px;
					text-indent: 15px;
				}
				.logbtn{
					text-align:center;
					line-height:36px;
					height: 36px;
					border:0;
					background:rgba(255,255,255,.8);
					width:120px;
					border-radius: 18px;
					display: inline-block;
					margin-left:60px;
					font-size: 14px;
					cursor:pointer;
				}
				.logbtn:hover{
					text-align:center;
					line-height:36px;
					border:0;
					background:rgba(255,255,255,.9);
					width:120px;
					border-radius: 18px;
					display: inline-block;
					margin-left:60px;
				}
				.resbtn{
					text-align:center;
					line-height:36px;
					border:0;
					background:rgba(255,255,255,.4);
					width:120px;
					border-radius: 18px;
					display: inline-block;
					margin-top:20px;
					margin-left:80px;
					margin-right:60px;
					font-size: 14px;
					cursor:pointer;
				}
				.resbtn:hover{
					text-align:center;
					line-height:36px;
					border:0;
					background:rgba(255,255,255,.5);
					width:120px;
					border-radius: 18px;
					display: inline-block;
					margin-top:20px;
					margin-left:80px;
					margin-right:60px;
					cursor:pointer;
				}
			}
			.remember {
				margin: 0px 0px 0px 0px;
				color:#fff;
			}
			.el-form {
				margin: 0 50px 50px 50px;
				.el-button--primary {
					margin-left: 70px;
					span {
						color: #fff;
					}
				}
			}
		}
	}
	
	.bounce-enter-active {
	  animation: bounce-in .5s;
	}
	
	@keyframes bounce-in {
	  0% {
	    transform:scale(0);
	    opacity: 0;
	  }
	  100% {
	    transform:scale(1);
	    opacity: 1;
	  }
	}	
	::-webkit-input-placeholder { /* WebKit, Blink, Edge */
		color:    #ccc;
	}
	:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
	color:    #ccc;
	}
	::-moz-placeholder { /* Mozilla Firefox 19+ */
	color:    #ccc;
	}
	:-ms-input-placeholder { /* Internet Explorer 10-11 */
	color:    #ccc;
	}
	input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
		background-color: rgba(0,0,0,.1) !important;
		background-image: none !important;
		color: rgb(255, 255, 255) !important;
	}
	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus {
		// box-shadow:0 0 0 60px #60647a inset;
		transition:background-color 5000s ease-in-out 0s;
		-webkit-text-fill-color: #fff;
	}

</style>