
<template>
	<div class="content-views">
		<h3>历史记录</h3>
		<div class="content-views-head">
			<div class="content-views-head-l">
				<el-form :model="search" ref="search" :inline="true">	
					<el-date-picker :inline="true" :picker-options="pickerOptions0" type="date" placeholder="选择起始日期" v-model="search.timeStart" style="width: 150px;" size="small"></el-date-picker>					
					<span>--</span>
					<el-date-picker :inline="true" :picker-options="pickerOptions1" type="date" placeholder="选择结束日期" v-model="search.timeEnd" style="width: 150px;" size="small"></el-date-picker>
					<el-button size="small" @click="searchHistory" icon="el-icon-search" type="primary" style="margin-left:20px;">查询</el-button>
				</el-form>
			</div>
		</div>
		<div class="content-views-body">
			<el-table ref="multipleTable" size="medium" v-loading="loading" :header-cell-style="getRowClass" border :data="tableData" height="100%" highlight-current-row style="text-align: center;" @selection-change="handleSelectionChange">				
			    <el-table-column type="index">
			    </el-table-column>
				<el-table-column prop="userName" label="操作者姓名">
				</el-table-column>
				<el-table-column prop="createTime" label="操作时间" sortable>
					<template slot-scope="scope">{{ scope.row.createTime }}</template>
				</el-table-column>
				<el-table-column prop="funName" label="应用函数">
				</el-table-column>
				<el-table-column label="下载报告" width="220">
					<template slot-scope="scope">
						<el-button type="text" @click="downLoadReport(scope.row)" size="small">
							<i class="el-icon-download"></i>&nbsp;下载PDF
						</el-button>
						<el-button type="text" @click="downLoadReportW(scope.row)" size="small">
							<i class="el-icon-download"></i>&nbsp;下载Word
						</el-button>
					</template>
				</el-table-column>
				<el-table-column label="删除操作" width="120">
					<template slot-scope="scope">
						<el-button type="text" @click="deleteReport(scope.row)" size="small" style="color:#f00">
							<i class="el-icon-delete"></i>&nbsp;删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>			
		</div>
		<div class="content-view-bottom">
			<div class="fy-right-bottom">
				<el-pagination
					@current-change="handleCurrentChange"
					:current-page="currentPage4"
					layout="total, prev, pager, next"
					:page-size=20
					:total='showPages'>
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import {getHistory,ossDownBaseURL_g,delHistory} from '../../api/api';
	export default {
		methods: {
			deleteReport(row){
				var rows=row;
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then((row) => {
					this.loading=true
					delHistory(window.sessionStorage.ApiUrl,{
						token:this.adminToken,
						id:rows.id
					}).then(res=>{
						if(res.data.status==200){	
							this.$message({
								type: 'success',
								message: '删除成功!'
							});		
							this.$router.push('/hisblank'); 
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
					}).catch()
				}).catch(()=>{
					return false
				});
			},
			downLoadReport(row){
				let fncURL=this.downLoadURL+row.reportPdf
				if(row.reportPdf!=''){
					window.open(fncURL, '_blank')
				}else{
					this.$message({
						type: 'info',
						message: '文件不存在!'
					});
				}
			},
			downLoadReportW(row){
				let fncURL=this.downLoadURL+row.reportStr
				if(row.reportStr!=''){
					window.open(fncURL, '_blank')
				}else{
					this.$message({
						type: 'info',
						message: '文件不存在!'
					});
				}
			},
			searchHistory(){
				this.loading=true;
				if(this.search.timeStart){
					var startDate=this.search.timeStart.getFullYear()+'-'+(this.search.timeStart.getMonth()+1)+'-'+this.search.timeStart.getDate()
				}
				if(this.search.timeEnd){
					var endDate=this.search.timeEnd.getFullYear()+'-'+(this.search.timeEnd.getMonth()+1)+'-'+this.search.timeEnd.getDate()
				}
				getHistory(window.sessionStorage.ApiUrl,{
					token:this.adminToken,
					page_start:1,
					page_size:20,
					start_date:startDate,
					end_date:endDate
				}).then(res=>{
					if(res.data.status==200){					
						var tableD=res.data.data.list;
						this.showPages=res.data.data.total
						this.tableData=tableD	
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
				}).catch(err=>{
					this.$message({
						type: 'info',
						message: '加载失败!'
					});
					this.loading=false
				});
			},
			//表格css控制
			getRowClass({ row, column, rowIndex, columnIndex }) {
				if (rowIndex == 0) {
					return 'background:#ddd;color:#000;'
				} else {
					return ''
				}
			},
		    handleCurrentChange(val) {
				var page=val;
				this.loading=true;
				var startDate;
				var endDate;
				if(this.search.timeStart){
					startDate=this.search.timeStart.getFullYear()+'-'+(this.search.timeStart.getMonth()+1)+'-'+this.search.timeStart.getDate()
				}
				if(this.search.timeEnd){
					endDate=this.search.timeEnd.getFullYear()+'-'+(this.search.timeEnd.getMonth()+1)+'-'+this.search.timeEnd.getDate()
				}
				getHistory(window.sessionStorage.ApiUrl,{
					token:this.adminToken,
					page_start:page,
					page_size:20,
					start_date:startDate,
					end_date:endDate
				}).then(res=>{
					if(res.data.status==200){					
						var tableD=res.data.data.list;
						this.showPages=res.data.data.total
						this.tableData=tableD	
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
				}).catch(err=>{
					this.$message({
						type: 'info',
						message: '加载失败!'
					});
					this.loading=false
				});
		    },
			handleSelectionChange(sels) {  
		        this.sels = sels;
		    },			
			toAddOpe(){
				this.$router.push('/addope')
			}
		},
		mounted(){
			this.downLoadURL=window.sessionStorage.DownLoadUrlH+ossDownBaseURL_g
			this.showData = this.tableData;
			this.adminToken=window.localStorage.getItem('adminToken')
			this.userName=window.localStorage.getItem('adminName')
			getHistory(window.sessionStorage.ApiUrl,{
					token:this.adminToken,
					page_start:1,
					page_size:20,
					start_date:this.search.timeStart,
					end_date:this.search.timeEnd
			}).then(res=>{
				if(res.data.status==200){					
					var tableD=res.data.data.list;
					this.showPages=res.data.data.total
					this.tableData=tableD	
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
			}).catch(err=>{
				this.$message({
					type: 'info',
					message: '加载失败!'
				});
				this.loading=false
			});
		},
		data() {
			return {
				pickerOptions0: {
					disabledDate: (time) => {
						if (this.search.timeEnd != "") {
							return time.getTime() > Date.now() || time.getTime() > this.search.timeEnd;
						} else {
							return time.getTime() > Date.now();
						}

					}
				},
				pickerOptions1: {
					disabledDate: (time) => {
						return time.getTime() < this.search.timeStart || time.getTime() > Date.now();
					}
				},
				search:{
					timeStart:'',
					timeEnd:''
				},
				downLoadURL:'',
				sels: [],
				currentPage4: 1,
				visible2:false,
				showData:[],
				form: {
					idcard:'',					
					password:'',
					name: '',
					tel:'',
					condition:true
				},
				showPages:0,
				tableData: [],
				loading:true,
				adminToken:'',
				userName:''
			}
		}
	}
</script>
<style lang="scss" scoped>
	.content-views {
		display:flex;
		flex-direction: column;
		height: 100%;
		padding: 0 10px;
		h3{
			flex:0 0 20px;
			height:50px;
			line-height:50px;
			border-bottom: 1px solid #ccc;
			text-indent: 10px;
			margin:0 5px;
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
				float:right;
				line-height: 40px;
				.el-pagination{
					padding:10px 0 0 0;
				}
			}
		}
		.content-views-body{
			padding:0 10px 0;
			flex:1;
			height:100%;
			overflow-y:auto;
			min-width:1000px;
		}
		.content-views-head{
			flex:0 0 50px;
			line-height: 50px;
			padding: 0 10px 0;
			min-width:1000px;
			.content-views-head-l{
				float: left;
			}
			.content-views-head-r{
				float: right;
			}
		}
	}
</style>