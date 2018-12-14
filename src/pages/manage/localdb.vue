
<template>
	<div class="content-views">
		<div class="user-list">
			<el-menu
				default-active="2-1"
				class="el-menu-vertical-demo"
				background-color="#222d32"
				text-color="#fff"
				active-text-color="#ffd04b"
				:unique-opened='true'
				:default-openeds="['2']">
				<div style="padding-left:30px;height:60px;line-height:60px;color:#FFF;background-color:rgb(27,36,40);border-bottom:2px solid #333;">
					<i class="el-icon-edit" style="font-size:16px;"></i>
					<span style="font-size:16px;">&nbsp;&nbsp;数据分析</span>
				</div>
				<!-- <el-submenu index="1" style="border-bottom:1px solid #333;">
					<template slot="title">
						<span style="padding-left:15px;">计算数据库</span>
					</template>
					<el-menu-item 
					v-for="item,index in dbNameList" 
					:index="'1-'+(index+1)" 
					style="padding-left:45px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
					:key="index"
					@click="changeDataBaseShow(item)"
					>
						{{item.dbName}}
					</el-menu-item>	
				</el-submenu> -->
				<el-menu-item index="1" style="padding-left:35px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-bottom:1px solid #333;" @click="toComDB">计算数据库</el-menu-item>
				<el-submenu index="2" style="border-bottom:1px solid #333;">
					<template slot="title">
						<span style="padding-left:15px;">本地数据库</span>
					</template>
					<el-menu-item 
					v-for="item,index in localDBList" 
					:index="'2-'+(index+1)" 
					style="padding-left:45px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
					:key="index"
					@click="changeLocalDataBaseShow(item)"
					>
						{{item.dbName}}
					</el-menu-item>
				</el-submenu>
			</el-menu>
		</div>
		<div class="content-view">
			<div class="content-views-head">
				<div class="content-views-head-l">
					<h3>本地数据库</h3>
				</div>
				<div class="content-views-head-r">			
					
				</div>			
			</div>
			<div class="content-views-body">
				<el-table ref="multipleTable"
					tooltip-effect="light"
					v-loading="loading"
					:header-cell-style="getRowClass"
					border 
					@selection-change="handleSelectionChange"
					:data="tableDataL"
					height="100%"
					highlight-current-row
					style="text-align: center;min-width: 1000px;" size="medium">
					<el-table-column type="selection">
					</el-table-column>
					<el-table-column type="index">
					</el-table-column>
					<el-table-column prop="inputDataChange" label="创建时间" sortable width="220">
						<template slot-scope="scope">{{ scope.row.inputDataChange[0].createTime }}</template>
					</el-table-column>
					<el-table-column v-for="itemI,indexI in inputDataL" :prop="'inputDataChange.'+indexI+'.'+itemI.dbAttr" :label="itemI.dbAttr" :key="itemI.dbAttr">
					</el-table-column>
				</el-table>			
			</div>
			
			<div class="content-view-bottom">				
				<div class="fy-right-bottom">
					<el-pagination
						@current-change="handleCurrentChange"
						:page-size=20
						:current-page="currentPage4"
						layout="total, prev, pager, next ,jumper"
						:total="showPages">
					</el-pagination>
				</div>
				<div class="btn-left-bottom">
					
				</div>
			</div>
			<div class="content-view-alert" v-if="alertIsShow">
				<h4>选择参数数据</h4>
				<el-form ref="" label-width="80px" class="add-addOpeForm-form demo-addOpeForm" size="small">
					<el-form-item label-width="0px" class="add-model-form-btn">
						<el-select v-model="attrs" multiple placeholder="请选择" style="width:280px;" filterable>
							<el-option
							v-for="item in inputData"
							:key="item.key"
							:label="item.key"
							:value="item.key"
							>
							</el-option>
						</el-select>
				    </el-form-item>	
					<el-form-item label-width="0px" class="add-model-form-btn">
						<el-button @click="dataListCompare" size="small" type="primary" class="add-model-form-btn1">确定</el-button>   
						<el-button @click="closeAlertNow" size="small" type="primary" class="add-model-form-btn2">取消</el-button>   
				    </el-form-item>	
				</el-form>
			</div>
			<div class="table-show" v-if="tableIsShow">
				<div class="charts" style="position:relative;">
					<tableShow></tableShow>
					<el-button type="text" @click="closeTableShow" style="font-size:20px; position:absolute;right:20px;top:5px;"><i class="el-icon-circle-close-outline"></i></el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import tableShow from "../../common/tableShow1.vue";
	import {getResultDBData,delResultDBData,getDataBind,getDataListDB,getResultDBDataCom,getLocalDBList,getLocalDBTh,getLocalDBData} from '../../api/api';
	export default{
		components: {
			tableShow
		},
		methods: {
			toComDB(){
				this.$router.push('/analysis')
			},
			changeLocalDataBaseShow(item){
				var itemL=item;
				this.dbItemID=itemL.id;
				getLocalDBTh(window.sessionStorage.ApiUrl,{
					token:this.adminToken,
					db_id:itemL.id
				}).then(res=>{		
					if(res.data.status==200){
						this.inputDataL=res.data.data.reverse()
						getLocalDBData(window.sessionStorage.ApiUrl,{
							token:this.adminToken,
							page_start:1,
							page_size:20,
							db_id:itemL.id
						}).then(res=>{		
							if(res.data.status==200){
								this.tableDataL=res.data.data.list
								this.loading=false
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
								this.loading=false
							}				
						}).catch(err=>{this.loading=false});
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
						this.loading=false
					}				
				}).catch(err=>{this.loading=false});
			},
			changeDataBaseShow(item){
				this.showLoaclDB=false;
				var itemH=item;
				this.dbItemID=itemH.id;
				getResultDBData(window.sessionStorage.ApiUrl,{
					token:this.adminToken,
					page_start:1,
					page_size:20,
					fun_id:itemH.funId,
					db_id:itemH.id
				}).then(res=>{		
					if(res.data.status==200){	
						this.showPages=res.data.data.list.length
						this.tableData=res.data.data.list
						this.inputData=this.tableData[0].result_table
						this.loading=false
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
						this.loading=false
					}				
				}).catch(err=>{this.loading=false});
			},
			mountedFunction(dbid,funid){
				var dbID=dbid;
				var funID=funid;
				var that=this;
				getResultDBData(window.sessionStorage.ApiUrl,{
					token:this.adminToken,
					page_start:1,
					page_size:20,
					fun_id:funID,
					db_id:dbID
				}).then(res=>{		
					if(res.data.status==200){	
						this.showPages=res.data.data.list.length
						this.tableData=res.data.data.list
						this.inputData=this.tableData[0].result_table
						this.loading=false
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
						this.loading=false
					}				
				}).catch(err=>{this.loading=false});
			},
			closeTableShow(){
				this.tableIsShow=false;
				this.alertIsShow=false;
			},
			showAlertNow(){
				if(this.sels.length>1){
					this.alertIsShow=true;
				}else{
					this.$message({
						type: 'info',
						message: '请至少勾选两次计算记录!'
					});
				}
			},
			closeAlertNow(){
				this.alertIsShow=false;
			},
			dataListCompare(){
				this.attrs=this.attrs.join(',')
				this.mids=this.sels.map(res=>res.mid)
				this.mids=this.mids.join(',')
				getResultDBDataCom(window.sessionStorage.ApiUrl,{
					token:this.adminToken,
					fun_id:this.functionID,
					mids:this.mids,
					attrs:this.attrs
				}).then(res=>{		
					if(res.data.status==200){						
						this.$message({
							type: 'success',
							message: '加载成功!'
						});
						this.$store.commit('comTableShowData1',res.data.data)
						this.tableIsShow=true;
						this.loading=false;
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
						this.loading=false
					}				
				}).catch(err=>{
					this.$message({
						type: 'info',
						message: '加载失败!'
					});
					this.loading=false
				});
			},
			handleSelectionChange(sels) {
				this.sels = this.allSels.concat(sels)
			},
			backToDataList(){
				this.$router.push("/data")
			},
			//删除
			deleteRow(row) {
				this.mids=this.sels.map(res=>res.mid)
				this.mids=this.mids.join(',')
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then((row) => {
					delResultDBData(window.sessionStorage.ApiUrl,{
						token:this.adminToken,
						mid:this.mids
					}).then(res=>{		
						if(res.data.status==200){						
							this.$message({
							type: 'success',
							message: '删除成功!'
							});
							this.loading=false;
							this.handleCurrentChange(1);
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
							message: '删除失败!'
							});
							this.loading=false
						}				
					}).catch(err=>{
						this.$message({
							type: 'info',
							message: '删除失败!'
						});
						this.loading=false
					});
				}).catch(()=>{
					return false
				});
			},
			selectChange(){

			},
			//表格css控制
			getRowClass({ row, column, rowIndex, columnIndex }) {
				if (rowIndex == 0) {
					return 'background:#ddd;color:#000;font-weight:100;font-size:10px;'
				} else {
					return ''
				}
			},
			//分页
		    handleCurrentChange(val) {
				var page=val;
				this.allSels=this.sels;
				if(this.showLoaclDB){
					getLocalDBData(window.sessionStorage.ApiUrl,{
						token:this.adminToken,
						page_start:val,
						page_size:20,
						db_id:this.dbItemID
					}).then(res=>{		
						if(res.data.status==200){
							this.tableDataL=res.data.data.list
							this.loading=false
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
							this.loading=false
						}				
					}).catch(err=>{this.loading=false});
				}else{
					getResultDBData(window.sessionStorage.ApiUrl,{
						token:this.adminToken,
						page_start:page,
						page_size:20,
						fun_id:this.functionID,
						db_id:this.dbItemID
					}).then(res=>{		
						if(res.data.status==200){						
							var tableD=res.data.data.list;
							this.tableData=tableD
							this.loading=false
							this.sels = this.allSels
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
							this.loading=false
						}				
					}).catch(err=>{
						this.$message({
							type: 'info',
							message: '加载失败!'
						});
						this.loading=false
					});
				}
				
		        
		    },
			getBackData(){
			}	
		},
		
		created(){
			if(window.localStorage.isAdminId=="2"){
				this.$router.push('/index')
			}
			this.adminToken=window.localStorage.getItem('adminToken')
			getDataListDB(window.sessionStorage.ApiUrl,{
				token:this.adminToken,
				page_start:1,
				page_size:500
			}).then(res=>{		
				if(res.data.status==200){
					this.dbNameList=res.data.data.list
					this.mountedFunction(this.dbNameList[0].id,this.dbNameList[0].funId)
					this.functionID=this.dbNameList[0].funId;
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
					this.loading=false
				}				
			}).catch(err=>{
				this.loading=false
			});
			getLocalDBList(window.sessionStorage.ApiUrl,{
				token:this.adminToken
			}).then(res=>{		
				if(res.data.status==200){
					this.localDBList=res.data.data
					this.changeLocalDataBaseShow(this.localDBList[0])
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
					message: '加载本地数据库失败!'
					});
					this.loading=false
				}				
			}).catch(err=>{});
		},
		data() {
			return {
				dbItemID:'',
				showLoaclDB:false,
				localDBList:[],
				functionID:'',
				dbNameList:[],
				tableIsShow:false,
				inputData:[],
				inputDataL:[],
				chooseFunID:'',
				downLoadBaseUrl:'',
				uploadUrl:'',
				showPages:0,
				adminToken:'',
				addOpeForm:{
					dataBaseName:'',
					btnIsAdd:true,
					funID:'',
					dataID:''
				},
				alertIsShow:false,
				loading:true,
				loadingA:false,
				search:{
					name:''
				},
				funList:[],
				allSels:[],
				sels: [],
				mids:[],
				attrs:[],
				currentPage4: 1,
				visible2:false,
				form: {
					idcard:'',					
					password:'',
					name: '',
					tel:'',
					condition:true
				},
				tableData: [],
				tableDataL: []
			}
		}
		
	}
</script>
<style lang="scss" scoped>
	.content-views {
		display:flex;		
		height: 100%;
		width: 100%;
		.user-list{
			flex:0 0 200px;
			height:100%;
			background: #222d32;
			overflow-y:auto;
			overflow-x:hidden;
		}
		.content-view {
			flex:1;
			display:flex;
			flex-direction: column;
			height: 100%;
			min-width:1076px;
			position: relative;
			.table-show{
				width:100%;
				height:100%;
				position: absolute;
				top:0;
				left:0;
				background: rgba(0,0,0,.8);
				text-align: center;
				z-index:1000;
				.charts{
					margin:100px auto 0;
					width:1000px;
				}
			}
			.content-view-alert{
				width:400px;
				position: absolute;
				top:50%;
				left:50%;
				margin-left: -200px;
				margin-top:-250px;
				background: #fff;
				border:1px solid #dcdfe6;
				border-radius: 5px;
				padding:30px 40px 10px 20px;
				box-sizing: border-box;
				h4{
					text-align: center;
					font-size: 16px;
					height:50px;
					line-height: 40px;
				}
				.add-model-form-btn{
					padding-left: 30px;
					padding-top: 10px;
					text-align: center;
				}
			}
			.content-views-nav{
				border-bottom: 1px solid #909290;
				flex:0 0 20px;
				line-height:20px;
				padding: 10px 15px 0;
				font-size: 12px;
				min-width: 990px;	
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
			.content-view-alert{
				width:400px;
				position: absolute;
				top:50%;
				left:50%;
				margin-left: -200px;
				margin-top:-250px;
				background: #fff;
				border:1px solid #dcdfe6;
				border-radius: 5px;
				padding:30px 40px 10px 20px;
				box-sizing: border-box;
				h4{
					text-align: center;
					font-size: 16px;
					height:50px;
					line-height: 40px;
				}
				.add-model-form-btn{
					padding-left: 30px;
					padding-top: 10px;
					text-align: center;
				}
			}
			.content-view-bottom{
				flex:0 0 50px;
				padding: 0 15px 0;
				min-width:1000px;
				line-height:50px;
				.btn-left-bottom{
					float:left;
					width:300px;
					height:50px;
				}
				.fy-right-bottom{
					margin-right: 0px;
					float:right;
					line-height: 40px;
					.el-pagination{
						padding:10px 0 0 0;
					}
				}
			}
			.content-views-body{
				padding:10px 10px 0;
				flex:1;
				height:100%;
				overflow-y:auto;
				min-width:1000px;
			}
			.content-views-head{
				flex:0 0 50px;
				line-height: 50px;
				text-indent: 15px;
				border-bottom: 1px solid #ccc;
				margin: 0 10px 0;
				min-width:1000px;
				.content-views-head-l{
					float: left;
				}
				.content-views-head-r{
					float: right;
				}
			}
		}
	}
	
</style>