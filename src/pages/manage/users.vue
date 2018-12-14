
<template>
	<div class="content-views">
		<div class="user-list">
			<el-menu
				default-active="1-1"
				class="el-menu-vertical-demo"
				background-color="#222d32"
				text-color="#fff"
				active-text-color="#ffd04b">
				<div style="padding-left:30px;height:60px;line-height:60px;color:#FFF;background-color:rgb(27,36,40);border-bottom:2px solid #333;">
					<i class="el-icon-edit" style="font-size:16px;"></i>
					<span style="font-size:16px;">&nbsp;&nbsp;个人信息</span>
				</div>
				<el-menu-item @click="editUser()" index="1-1" style="padding-left:45px;">编辑个人信息</el-menu-item>
				<el-menu-item @click="editPassword()" index="1-2" style="padding-left:45px;">修改密码</el-menu-item>
			</el-menu>
		</div>
		<div class="user-cont" v-show="!isEditPwd">
			<h3>编辑个人信息</h3>
			<el-form :model="ruleForm1" status-icon :rules="rules1" ref="ruleForm1" label-width="80px" class="demo-ruleForm">
				<el-form-item label-width="0">
					<h4>登录账号：{{ruleForm2.loginName}}</h4>
				</el-form-item>
				<el-form-item label="用户姓名" prop="name">
					<el-input v-model="ruleForm1.name" size="small" placeholder="请输入姓名"></el-input>
				</el-form-item>
				<el-form-item label="联系方式" prop="tel">
					<el-input v-model.number="ruleForm1.tel" size="small" placeholder="请输入11位电话号码"></el-input>
				</el-form-item>
				<el-form-item label-width="36px" style="text-align:center">
					<el-button type="primary" @click="submitForm('ruleForm1')" size='small'>保存</el-button>
					<el-button @click="resetForm('ruleForm1')" size='small'>重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="user-cont" v-show="isEditPwd">
			<h3>修改密码</h3>
			<el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="80px" class="demo-ruleForm">
				<el-form-item label-width="0">
					<h4>登录账号：{{ruleForm2.loginName}}</h4>
				</el-form-item>
				<el-form-item label="原密码" prop="oldPass">
					<el-input type="password" v-model="ruleForm2.oldPass" auto-complete="off" size="small" placeholder="请输入原密码"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="pass">
					<el-input type="password" v-model="ruleForm2.pass" auto-complete="off" size="small" placeholder="请输入新密码"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" size="small" placeholder="请再次输入密码"></el-input>
				</el-form-item>
				<el-form-item label-width="36px" style="text-align:center">
					<el-button type="primary" @click="submitForm2('ruleForm2')" size='small'>提交</el-button>
					<el-button @click="resetForm('ruleForm2')" size='small'>重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import { getUserById,editUserById } from '../../api/api';
	export default {
		methods: {
			editUser(){
				this.isEditPwd=false
				
			},
			editPassword(){
				this.isEditPwd=true
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
				
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$confirm('请您确认编辑操作', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							//确认后执行函数
							var params = new URLSearchParams();
							params.append('id', window.localStorage.adminId);
							params.append('user_phone', this.ruleForm1.tel);
							params.append('user_name',this.ruleForm1.name);
							params.append('token',window.localStorage.adminToken);				
							editUserById(window.sessionStorage.ApiUrl,params).then(res => {
								if (res.data.status == 200) {
									this.$message({
										type: 'success',
										message: '保存成功!'
									});
									window.localStorage.setItem('adminName',this.ruleForm1.name)
									this.$router.push('/index');
								}else if(res.data.status == 201){
									this.$message({
										type: 'info',
										message: 'token失效，为保障账户安全，请重新登陆'
									});						 
									window.localStorage.clear()
									window.window.sessionStorage.setItem('isLogin','0')
									this.$router.push('/login'); 
								} else {
									this.$message({
										type: 'info',
										message: '保存失败'
									});
								}
							}).catch(err => {
								this.$message({
									type: 'info',
									message: '保存失败'
								});
							});
						}).catch();
					} else {
						this.$message({
							type: 'info',
							message: '请确认内容是否全部填写正确'
						});
					}
				});
			},
			submitForm2(formName) {			
				let adminID=window.localStorage.getItem('adminId')
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$confirm('请您确认编辑操作', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							//确认后执行函数
							var params = new URLSearchParams();
							params.append('id', window.localStorage.adminId);
							params.append('login_pwd',this.ruleForm2.pass);
							params.append('login_pwd_old',this.ruleForm2.oldPass);
							params.append('token',window.localStorage.adminToken);				
							editUserById(window.sessionStorage.ApiUrl,params).then(res => {
								if (res.data.status == 200) {
									this.$message({
										type: 'success',
										message: '保存成功!'
									});
									this.$router.push('/login');
								}else if(res.data.status == 201){
									this.$message({
										type: 'info',
										message: 'token失效，为保障账户安全，请重新登陆'
									});						 
									window.localStorage.clear()
									window.window.sessionStorage.setItem('isLogin','0')
									this.$router.push('/login'); 
								} else if(res.data.status == 400){
									this.$message({
										type: 'info',
										message: '原密码输入有误，请重新填写'
									});
								}else {
									this.$message({
										type: 'info',
										message: '保存失败'
									});
								}
							}).catch(err => {
								this.$message({
									type: 'info',
									message: '保存失败'
								});
							});
						}).catch();
					} else {
						this.$message({
							type: 'info',
							message: '请确认内容是否全部填写正确'
						});
					}
				});
			}
		},
		created(){
			getUserById(window.sessionStorage.ApiUrl,{
				'id': window.localStorage.adminId,
				'token': window.localStorage.adminToken
			}).then(res => {
				if (res.data.status == 200) {
					this.ruleForm2.loginName=res.data.data.loginName
					this.ruleForm1.name=res.data.data.userName
					this.ruleForm1.tel=res.data.data.userPhone
				}else if(res.data.status == 201){
					this.$message({
						type: 'info',
						message: 'token失效，为保障账户安全，请重新登陆'
					});						 
					window.localStorage.clear()
					window.window.sessionStorage.setItem('isLogin','0')
					this.$router.push('/login'); 
				}else{
					this.$message({
						type: 'info',
						message: '加载失败!'
					});
				}				
			}).catch(err => {
				this.ruleForm2.loading = false
			})
		},
		data() {
			var checkTel = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('手机号不能为空'));
				} else {
					const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
					if (reg.test(value)) {
						callback();
					} else {
						return callback(new Error('请输入正确的手机号'));
					}
				}
			};
			var validatePass = (rule, value, callback) => {
				const reg = /^\w{6,14}$/
				if (value === '') {
					callback(new Error('请输入6-14位字母或数字组合'));
				} else if (reg.test(value)) {
					if (this.ruleForm2.checkPass !== '') {
						this.$refs.ruleForm2.validateField('checkPass');
					}
					callback();
				} else {
					return callback(new Error('请输入6-14位字母或数字组合'));
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm2.pass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				isEditPwd:false,
				ruleForm1: {
					name: '',
					tel: ''
				},
				ruleForm2: {
					name: '',
					loginName: '',
					tel: '',
					oldPass:'',
					pass: '',
					checkPass: '',
					loginName: '',
					isShow: true,
					loading: true
				},
				rules1: {
					loginName: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 5,
							max: 11,
							message: '长度在5 到 11 个字符',
							trigger: 'blur'
						}],
					tel: [{
						required: true,
						validator: checkTel,
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}]
				},
				rules2: {
					pass: [{
							validator: validatePass,
							trigger: 'blur'
						},
						{
							min: 6,
							max: 14,
							message: '密码长度在6 到 14 个字符',
							trigger: 'blur'
						},
						{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						}
					],
					oldPass: [{
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
					],
					checkPass: [{
							validator: validatePass2,
							trigger: 'blur'
						},
						{
							min: 6,
							max: 14,
							message: '长度在6 到 14 个字符',
							trigger: 'blur'
						},
						{
							required: true,
							message: '请再次输入密码',
							trigger: 'blur'
						}
					]
				}
			}
		},
	}
</script>
<style lang="scss" scoped>
	.content-views {
		display:flex;		
		height: 100%;
		.user-list{
			flex:0 0 200px;
			height:100%;
			background: #222d32;
			border-right: solid 1px #e6e6e6;
			overflow-y:auto;
			overflow-x:hidden;
		}
		.user-cont{
			flex:1;
			height:100%;
			overflow-y:auto;
			padding:0 15px;
			position: relative;
			h3{
				height:50px;
				line-height:50px;
				border-bottom: 1px solid #ccc;
				text-indent: 10px;
			}
			.demo-ruleForm{
				padding:20px 0;
				width:260px;
				position: absolute;
				left:50%;
				margin-left:-150px;
				h4{
					text-align: center;
					font-size: 14px;
				}
			}
		}
	}
	
</style>