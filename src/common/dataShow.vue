<template>
    <div id="myChart">
        <h3>导入历史数据</h3>
		<div class="content-views-head">
			<div class="content-views-head-l">
                    <el-date-picker
                    v-model="createDate"
                    :inline="true"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions1"
                    size="small"
                    style="width:170px;">
                    </el-date-picker>
					<el-button size="small" @click="searchHistory" icon="el-icon-search" type="primary" style="margin-left:20px;">查询</el-button>
			</div>
		</div>
		<div class="content-views-body">
			<el-table class="body-l" ref="multipleTable" size="medium" v-loading="loading" :header-cell-style="getRowClass" border :data="tableData" height="100%" highlight-current-row style="text-align: center;" @selection-change="handleSelectionChange">				
			    <el-table-column type="index" width="50">
			    </el-table-column>
				<el-table-column prop="create_time" label="计算时间" sortable>
					<template slot-scope="scope">{{ scope.row.create_time }}</template>
				</el-table-column>
				<el-table-column label="操作" width="180">
					<template slot-scope="scope">
						<el-button type="text" @click="showReport(scope.row)" size="small">
							<i class="el-icon-search"></i>&nbsp;展示数据
						</el-button>
                        <el-button type="text" @click="deleteReport(scope.row)" size="small" style="color:#f00">
							<i class="el-icon-delete"></i>&nbsp;删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>	
            <div class="body-r">
                <el-form class="operation-step-paras">
					<h4 class="s-p-name">数据展示</h4>
					<div class="operation-step-para" v-model="paraShowList" v-for="para,indexZ in paraShowList" :key="indexZ">
						<h4>{{para.funParaName }}</h4>
						<div class="cont-r" v-for="showForm,indexA in paraShowList[indexZ].funParaDesc" :key="indexA">
							<p style="width:100%">
								<el-tooltip effect="light" :content="showForm.describleA" placement="top-start" v-if="showForm.describleA">
									<i class="el-icon-question" style="position:absolute;right:20px;top:1px;line-height:30px;color:#409EFF"></i>
								</el-tooltip>
								<span v-if="showForm.title" style="margin-left:5px;">{{showForm.title}}:</span>
								<span v-if="showForm.typeA==='text'">{{showForm.valueA}}</span>
								<input type="text" v-if="showForm.typeA==='value'" :value="showForm.valueA" placeholder="值">
								<span v-if="showForm.typeA==='value'">{{showForm.unitA}}</span>
								<el-button type="primary" v-if="showForm.typeA==='button'" icon="create-showForm-item-add" size="mini">导入数据</el-button>
								<el-radio v-model="showForm.radioA" label="1" v-if="showForm.typeA === 'special'">是</el-radio>
								<el-radio v-model="showForm.radioA" label="0" v-if="showForm.typeA === 'special'">否</el-radio>	
							</p>
							<div class="cont-r-showForm">
								<el-form :model="showForm" size="mini" class="create-showForm" label-position="right" ref="ichooa">
									<div v-for="(item, indexS) in showForm.showFormCreate" :key="indexS" class="create-showForm-item" :id="item.typeI" v-if="showForm.radioA !== '0'">
										<el-form-item v-if="item.typeI === 'text'" :label="item.labelI" label-width="220px">
											<el-input type="text" :inline="true" style="width:50%;" v-model.number="item.valueI" placeholder="输入值"></el-input>
											<span style="width:25%;font-size:12px;" v-model="item.unitI">{{item.unitI}}</span>
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI" style="position:absolute;right:3px;line-height:30px;color:#409EFF">
												<i class="el-icon-question"></i>
											</el-tooltip>
										</el-form-item >
										<!-- 禁用项 -->
										<el-form-item v-if="item.typeI === 'textD'" :label="item.labelI" label-width="220px" >									
											<el-input :inline="true" style="width:50%;" disabled v-model.number="item.valueI" placeholder=""></el-input>
											<span style="width:25%;font-size:12px;" v-model="item.unitI">{{item.unitI}}</span>
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI" style="position:absolute;right:3px;line-height:30px;color:#409EFF">
												<i class="el-icon-question"></i>
											</el-tooltip>
										</el-form-item >
										<!--  单行行内文本-->
										<el-form-item :inline="true"  v-if="item.typeI === 'text2'" label-width="50%" :label="item.labelI">									
											<el-input :inline="true" style="width:50%" v-model.number="item.valueI" placeholder="输入值"></el-input>
											<span style="width:45%;display:inline-block;font-size:12px;" v-model="item.unitI">{{item.unitI}}</span>
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI" style="position:absolute;right:-20px;top:1px;line-height:30px;color:#409EFF">
												<i class="el-icon-question"></i>
											</el-tooltip>
										</el-form-item>
										<!--  图片 -->
										<el-form-item v-if="item.typeI === 'img'" style="text-align:center;">
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI">
												<img v-if="item.imageUrl" :src="downLoadImgBaseUrl+item.imageUrl" alt="" style="display:inline-block;max-width:80%;max-height:200px;border:1px dashed #ccc;">
												<img src="" alt="示例图片" v-if="!item.imageUrl" width="120" height="80" style="border:1px dashed #ccc;display:inline-block;">
											</el-tooltip>
											<div v-if="!item.describleI">
												<img v-if="item.imageUrl" :src="downLoadImgBaseUrl+item.imageUrl" alt="" style="background:#eee;display:inline-block;max-width:80%;max-height:200px;border:1px dashed #ccc;">
												<img src="" alt="示例图片" v-if="!item.imageUrl" width="120" height="80" style="border:1px dashed #ccc;display:inline-block;">	
											</div>
										</el-form-item >
										<!--  区间文本-->
										<el-form-item v-if="item.typeI === 'text1'" label-width="220px" :label="item.labelI">
											<el-input :inline="true" style="width:33%;" v-model.number="item.valueI" placeholder="区间值1"></el-input>
											<span>-</span>
											<el-input :inline="true" style="width:33%;" v-model.number="item.valueI2" placeholder="区间值2"></el-input>										
											<span style="width:15%;font-size:12px;" v-model="item.unitI">{{item.unitI}}</span>
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI" style="position:absolute;right:3px;line-height:30px;color:#409EFF">
												<i class="el-icon-question"></i>
											</el-tooltip>
										</el-form-item >
										<el-form-item v-if="item.typeI === 'text1D'" label-width="220px" :label="item.labelI">
											<el-input :inline="true" style="width:33%;" disabled v-model.number="item.valueI" placeholder=""></el-input>
											<span>-</span>
											<el-input :inline="true" style="width:33%;" disabled v-model.number="item.valueI2" placeholder=""></el-input>										
											<span style="width:15%;font-size:12px;" v-model="item.unitI">{{item.unitI}}</span>
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI" style="position:absolute;right:3px;line-height:30px;color:#409EFF">
												<i class="el-icon-question"></i>
											</el-tooltip>
										</el-form-item >
										<!--  多行文本-->
										<el-form-item v-if="item.typeI === 'textarea'" class="showForm-textarea" label-width="75px" :label="item.labelI">
											<el-input type="textarea" v-model="item.valueI" class="textarea-value" placeholder="多行文本描述" style="margin:0;"></el-input>	
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI" style="position:absolute;right:3px;line-height:30px;color:#409EFF">
												<i class="el-icon-question"></i>
											</el-tooltip>									
										</el-form-item >
										<!--  下拉菜单文本-->
										<el-form-item  v-if="item.typeI === 'select'" class="showForm-select" label-width="40%" :label="item.labelI">
											<el-select v-model="item.valueI" placeholder="请选择" >
												<el-option v-for="para,indexL in showForm.showFormCreate[indexS].valueForm"
												:label="para.labelL"
												:value="para.labelL"
												:key="indexL">
												</el-option> 
											</el-select>
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI" style="position:absolute;right:3px;line-height:30px;color:#409EFF">
												<i class="el-icon-question"></i>
											</el-tooltip>
										</el-form-item >		
										<!--  多选框-->		
										<el-form-item v-if="item.typeI === 'checkbox'" label-width="75px" :label="item.labelI" style="border:1px solid #ccc;padding:20px 20px 10px 0;border-radius:4px;">
											<el-tooltip effect="light" :content="item.describleI" placement="top-end"  style="position:absolute;right:3px;line-height:30px;color:#409EFF;z-index:999;" v-if="item.describleI">
												<i class="el-icon-question"></i>
											</el-tooltip>
											<el-checkbox-group v-model="item.valueI">
												<el-checkbox v-for="para,indexL in showForm.showFormCreate[indexS].valueForm"
												:label="indexL"
												:key="indexL"
												:name="item.typeI+indexS"
												class="create-showForm-choose"											
												style="width:100%;"
												v-show="para.labelL&&para.typeL!='img'"
												>
													<span v-if="para.typeL==='text'">{{para.labelL}}</span>
													<span v-if="para.typeL==='textDes'">{{para.labelL}}</span>
													<span v-if="para.typeL==='img'"> </span>
													<img :src="downLoadImgBaseUrl+para.imageUrl" alt="" v-if="para.typeL==='img'&&para.imageUrl" style="border:1px dashed #ccc;max-width:80%;max-height:200px;">
													<el-form class="choose-textD-list"
													v-model="showForm.showFormCreate[indexS].valueForm"
													size="mini"
													label-width="75px"
													v-if="para.typeL==='textDes'"
													style="width:200px;margin-left:50px;">
														<el-form-item v-for="parades,indexD in para.listL" :key="indexD" class="list-detial" :label="parades.labelD">
															<el-input :inline="true" style="width:80px;" v-model.number="parades.valueD" placeholder="值"></el-input>
															<a style="display:inline">{{parades.unitD}}</a>
														</el-form-item>
													</el-form>
													<span v-if="para.typeL==='uploadBtn'&&para.labelL" style="height:28px;line-height: 28px;width:30%;display:inline-block;position:absolute;">{{para.labelL}}</span>
													<el-input v-if="para.typeL==='uploadBtn'" :inline="true" style="width:20%;margin-left:30%;" disabled v-model="para.valueL" placeholder="值"></el-input>
													<el-upload
													v-if="para.typeL==='uploadBtn'"
													class="avatar-uploader"
													:action="uploadUrl"
													:show-file-list="false"
													>
														<el-button :inline="true" v-if="para.typeL==='uploadBtn'" size="mini" type="primary" style="position:absolute;right:0;top:0;">读取</el-button>
													</el-upload>
												</el-checkbox>								
											</el-checkbox-group>								
										</el-form-item >		
										<!--  单选框-->
										<el-form-item v-if="item.typeI === 'radio'" :label="item.labelI" style="border:1px solid #ccc;padding:10px 10px 10px 0;border-radius:4px;">	
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" style="z-index:999;position:absolute;right:3px;line-height:30px;color:#409EFF" v-if="item.describleI">
												<i class="el-icon-question" style=""></i>
											</el-tooltip>	
											<el-radio-group v-model="item.valueI" class="showForm-choose">										
												<el-radio v-for="para,indexL in showForm.showFormCreate[indexS].valueForm"
												:label="indexL"
												:key="indexL"
												:name="item.typeI+indexS"
												class="create-showForm-choose"											
												style="width:100%;">
													<span v-if="para.typeL==='text'" >{{para.labelL}}</span>
													<span v-if="para.typeL==='textDes'">{{para.labelL}}</span>
													<img :src="downLoadImgBaseUrl+para.imageUrl" alt="图片示例" v-if="para.typeL==='img'" style="border:1px dashed #ccc;max-width:80%;max-height:200px;">
													<el-form class="choose-textD-list" v-model="showForm.showFormCreate[indexS].valueForm" size="mini" label-width="100px" v-if="para.typeL==='textDes'" style="width:200px;margin-left:50px;">
														<el-form-item v-for="parades,indexD in para.listL" :key="indexD" class="list-detial" :label="parades.labelD" v-if="item.valueI===indexL">
															<el-input :inline="true" style="width:80px;" v-model.number="parades.valueD" placeholder="值"></el-input>
															<a style="display:inline">{{parades.unitD}}</a>
														</el-form-item>
														<el-form-item v-for="parades,indexD in para.listL" :key="indexD" class="list-detial" :label="parades.labelD" v-if="item.valueI!==indexL">
															<el-input :inline="true" style="width:80px;" v-model.number="parades.valueD" placeholder="值" disabled></el-input>
															<span>{{parades.unitD}}</span>
														</el-form-item>
													</el-form>
													<span v-if="para.typeL==='uploadBtn'&&para.labelL" style="height:28px;line-height: 28px;width:30%;display:inline-block;position:absolute;">{{para.labelL}}</span>
													<el-input v-if="para.typeL==='uploadBtn'" :inline="true" style="width:40%;margin-left:30%;" disabled v-model="para.valueL" placeholder="值"></el-input>
													<el-upload
													v-if="para.typeL==='uploadBtn'"
													class="avatar-uploader"
													:action="uploadUrl"
													:show-file-list="false"
													>
														<el-button :inline="true" v-if="para.typeL==='uploadBtn'" size="mini" type="primary" style="position:absolute;right:0;top:0;">读取</el-button>
													</el-upload>
												</el-radio>	
											</el-radio-group>	
										</el-form-item >							
										<!--  特殊item-->
										<el-form-item v-if="item.typeI === 'itvFnc'" class="showForm-itvFnc">
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" style="z-index:999;position:absolute;right:3px;line-height:30px;color:#409EFF" v-if="item.describleI">
												<i class="el-icon-question" style=""></i>
											</el-tooltip>
											<div style="height:32px;overflow:hidden;"><b>{{item.titleI}}</b></div>
											<div v-for="fnc,indexF in item.valueI" :key="indexF" class="showForm-itvFnc-cont">
												<b style="display:inline-block;min-width:15%; text-align:right;">{{fnc.labelI}}</b>
												<el-input :inline="true" style="width:30%;" v-model="fnc.valueI1" placeholder="函数方程"></el-input><b>X</b>∈
												<el-input :inline="true" style="width:16%;" v-model.number="fnc.valueI2" placeholder="区间值"></el-input>-
												<el-input :inline="true" style="width:16%;" v-model.number="fnc.valueI3" placeholder="区间值"></el-input>									
											</div>
											<el-button type="text" class="showForm-itvFnc-btn1" icon="el-icon-circle-plus-outline"></el-button>
											<el-button type="text" class="showForm-itvFnc-btn2" icon="el-icon-remove-outline"></el-button>	
										</el-form-item >
										<el-form-item v-if="item.typeI === 'paraCheck'" class="showForm-paraCheck">
											<div style="text-align:left"><b>{{item.titleI}}</b></div>
											<div class="paraCheck-h">
												<span class="paraCheck-h-t">L</span>
												<span class="paraCheck-h-t">Dο</span>
												<span class="paraCheck-h-t">dο</span>
												<span class="paraCheck-h-t">Kσ</span>
												<span class="paraCheck-h-t">Kτ</span>
												<span class="paraCheck-h-t">εσ</span>
												<span class="paraCheck-h-t">ετ</span>
												<span class="paraCheck-h-t">Ψσ</span>
												<span class="paraCheck-h-t">Ψτ</span>
												<span class="paraCheck-h-t">β</span>
											</div>
											<div class="paraCheck-b" v-for="fnc,indexF in item.valueI" :key="indexF">
												<span class="paraCheck-b-t" style="border:0;">截面</span>
												<input class="paraCheck-b-c" v-model.number="fnc.valueI1"></input>
												<input class="paraCheck-b-c" v-model.number="fnc.valueI2"></input>
												<input class="paraCheck-b-c" v-model.number="fnc.valueI3"></input>
												<input class="paraCheck-b-c" v-model.number="fnc.valueI4"></input>
												<input class="paraCheck-b-c" v-model.number="fnc.valueI5"></input>
												<input class="paraCheck-b-c" v-model.number="fnc.valueI6"></input>
												<input class="paraCheck-b-c" v-model.number="fnc.valueI7"></input>
												<input class="paraCheck-b-c" v-model.number="fnc.valueI8"></input>
												<input class="paraCheck-b-c" v-model.number="fnc.valueI9"></input>
												<input class="paraCheck-b-c" v-model.number="fnc.valueI10"></input>
											</div>
											<el-button type="text" class="paraCheck-btn1" icon="el-icon-circle-plus-outline"></el-button>
											<el-button type="text" class="paraCheck-btn2" icon="el-icon-remove-outline"></el-button>
										</el-form-item>
									</div>
									<!--否选项-->
									<div v-for="(item, indexS) in showForm.showFormCreateN" :key="indexS" class="create-showForm-item" :id="item.typeI" v-if="showForm.radioA === '0'">
										<el-form-item v-if="item.typeI === 'img'" style="text-align:center;">
											<img v-if="item.imageUrl" :src="downLoadImgBaseUrl+item.imageUrl" alt="示例图片" style="display:inline-block;max-width:80%;max-height:200px;border:1px dashed #ccc;">
											<img v-if="!item.imageUrl" src="" alt="示例图片" width="120" height="100" style="border:1px dashed #ccc;">
										</el-form-item >
										<!--  特殊item-->
										<el-form-item v-if="item.typeI === 'itvFnc'" class="showForm-itvFnc">
											
											<div v-for="fnc,indexF in item.valueI" :key="indexF" class="showForm-itvFnc-cont">
												<div style="height:32px;overflow:hidden;"><b>{{item.titleI}}</b></div>
												<b>{{fnc.labelI}}</b>
												<el-input :inline="true" style="width:30%;" v-model="fnc.valueI1" placeholder="函数方程"></el-input><b>X</b>∈
												<el-input :inline="true" style="width:16%;" v-model.number="fnc.valueI2" placeholder="区间值"></el-input>-
												<el-input :inline="true" style="width:16%;" v-model.number="fnc.valueI3" placeholder="区间值"></el-input>									
											</div>
											<el-button type="text" class="showForm-itvFnc-btn1" icon="el-icon-circle-plus-outline"></el-button>
											<el-button type="text" class="showForm-itvFnc-btn2" icon="el-icon-remove-outline"></el-button>	
										</el-form-item >
										<el-form-item v-if="item.typeI === 'paraCheck'" class="showForm-paraCheck">
											<div style="text-align:left"><b>{{item.titleI}}</b></div>
											<div class="paraCheck-h">
												<span class="paraCheck-h-t">L</span>
												<span class="paraCheck-h-t">Dο</span>
												<span class="paraCheck-h-t">dο</span>
												<span class="paraCheck-h-t">Kσ</span>
												<span class="paraCheck-h-t">Kτ</span>
												<span class="paraCheck-h-t">εσ</span>
												<span class="paraCheck-h-t">ετ</span>
												<span class="paraCheck-h-t">Ψσ</span>
												<span class="paraCheck-h-t">Ψτ</span>
												<span class="paraCheck-h-t">β</span>
											</div>
											<div class="paraCheck-b" v-for="fnc,indexF in item.valueI" :key="indexF">
												<span class="paraCheck-b-t">截面</span>
												<!-- <input :inline="true" v-model="fnc.labelI" placeholder="" class="paraCheck-b-t"></input> -->
												<input :inline="true" class="paraCheck-b-c" v-model.number="fnc.valueI1"></input>
												<input :inline="true" class="paraCheck-b-c" v-model.number="fnc.valueI2"></input>
												<input :inline="true" class="paraCheck-b-c" v-model.number="fnc.valueI3"></input>
												<input :inline="true" class="paraCheck-b-c" v-model.number="fnc.valueI4"></input>
												<input :inline="true" class="paraCheck-b-c" v-model.number="fnc.valueI5"></input>
												<input :inline="true" class="paraCheck-b-c" v-model.number="fnc.valueI6"></input>
												<input :inline="true" class="paraCheck-b-c" v-model.number="fnc.valueI7"></input>
												<input :inline="true" class="paraCheck-b-c" v-model.number="fnc.valueI8"></input>
												<input :inline="true" class="paraCheck-b-c" v-model.number="fnc.valueI9"></input>
												<input :inline="true" class="paraCheck-b-c" v-model.number="fnc.valueI10"></input>
											</div>
											<el-button type="text" class="paraCheck-btn1" icon="el-icon-circle-plus-outline"></el-button>
											<el-button type="text" class="paraCheck-btn2" icon="el-icon-remove-outline"></el-button>
										</el-form-item>
									</div>
								</el-form>
							</div>
						</div>
					</div>
                </el-form>
            </div>		
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
            <div class="btn-left-bottom">
               &nbsp;
            </div>
		</div>
    </div>
</template>

<script>
import {getHistory,ossDownBaseURL_g,delHistory,getHistoryPara,delHistoryPara} from '../api/api';
    export default {
        data () {
            return {
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                        picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                        }
                    }]
                },
                downLoadImgBaseUrl:'',
                paraShowList:[],
				createDate:'',
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
                userName:'',
                uploadUrl:''
            }
        },
        mounted() {
            this.downLoadImgBaseUrl=window.sessionStorage.DownLoadUrlH+ossDownBaseURL_g
            this.downLoadURL=window.sessionStorage.DownLoadUrlH+ossDownBaseURL_g
			this.showData = this.tableData;
			this.adminToken=window.localStorage.getItem('adminToken')
			this.userName=window.localStorage.getItem('adminName')
			getHistoryPara(window.sessionStorage.ApiUrl,{
					token:this.adminToken,
					page_start:1,
					page_size:20,
					create_date:'',
                    user_id:window.localStorage.adminId,
                    fun_id:this.$store.state.funDataParaID
			}).then(res=>{
				if(res.data.status==200){	
					var tableD=res.data.data.list;
					this.showPages=res.data.data.total
					this.tableData=tableD	
                    this.loading=false
                    if(tableD.length>0){
                        this.paraShowList=tableD[0].fun_para
                    }
                    this.$store.commit('changeTableDataShowNow',tableD[0].fun_para)
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
        },
        methods: {
            showReport(row){
				var rows=row;
                this.paraShowList=rows.fun_para
                this.$store.commit('changeTableDataShowNow',rows.fun_para)
            },
            deleteReport(row){
                var that=this;
				var rows=row;
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then((row) => {
					this.loading=true
					delHistoryPara(window.sessionStorage.ApiUrl,{
						token:this.adminToken,
						mid:rows.mid
					}).then(res=>{
						if(res.data.status==200){	
							this.$message({
								type: 'success',
								message: '删除成功!'
							});		
							that.searchHistory();
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
                var createDateDay
                if(this.createDate){
                    var createDateDay=this.createDate.getDate()
                    if(this.createDate.getDate()<10){
                        createDateDay='0'+this.createDate.getDate()
                    }
                    var createDateNow=this.createDate.getFullYear()+'-'+(this.createDate.getMonth()+1)+'-'+createDateDay
                }
                getHistoryPara(window.sessionStorage.ApiUrl,{
					token:this.adminToken,
					page_start:1,
					page_size:20,
					create_date:createDateNow,
                    user_id:window.localStorage.adminId,
                    fun_id:this.$store.state.funDataParaID
                }).then(res=>{
                    if(res.data.status==200){		
                        var tableD=res.data.data.list;
                        this.showPages=res.data.data.total
                        this.tableData=tableD	
                        this.loading=false
                        if(tableD.length>0){
                            this.paraShowList=tableD[0].fun_para
                        }
                        this.$store.commit('changeTableDataShowNow',tableD[0].fun_para)
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
                var createDateDay
                if(this.createDate){
                    var createDateDay=this.createDate.getDate()
                    if(this.createDate.getDate()<10){
                        createDateDay='0'+this.createDate.getDate()
                    }
                    var createDateNow=this.createDate.getFullYear()+'-'+(this.createDate.getMonth()+1)+'-'+createDateDay
                }
                getHistoryPara(window.sessionStorage.ApiUrl,{
					token:this.adminToken,
					page_start:page,
					page_size:20,
					create_date:createDateNow,
                    user_id:window.localStorage.adminId,
                    fun_id:this.$store.state.funDataParaID
                }).then(res=>{
                    if(res.data.status==200){		
                        var tableD=res.data.data.list;
                        this.showPages=res.data.data.total
                        this.tableData=tableD	
                        this.loading=false
                        if(tableD.length>0){
                            this.paraShowList=tableD[0].fun_para
                        }
                        this.$store.commit('changeTableDataShowNow',tableD[0].fun_para)
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
		    },
			handleSelectionChange(sels) {  
		        this.sels = sels;
		    },			
			toAddOpe(){
				this.$router.push('/addope')
			}
        }
    }
</script>
<style lang="scss" scoped>
    #myChart{
        margin:0 auto;
        background: #fff;
        width: 100%;
        height:100%;
        border:15px solid rgba(0,0,0,.8);
        box-sizing: border-box;
        display:flex;
		flex-direction: column;
		padding: 0 10px;
        z-index:1000;
		h3{
            text-align: left;
			flex:0 0 20px;
			height:50px;
			line-height:50px;
			border-bottom: 1px solid #ccc;
			text-indent: 10px;
		}
		.content-view-bottom{
			flex:0 0 50px;
			padding: 0 10px 0;
			min-width:400px;
			line-height:50px;
            display:flex;
			.btn-left-bottom{
				flex:1;
				 min-width:560px;
                max-width:800px;
				height:50px;
                text-align: right;
			}
			.fy-right-bottom{
				flex:1;
				min-width: 440px;
				line-height: 40px;
                text-align: right;
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
			min-width:400px;
            display:flex;
            .body-l{
                flex:1;
                min-width: 440px;
            }
            .body-r{
                flex:1;
                margin:0 0 0 15px;
                overflow-y:auto;
                overflow-x:hidden;
                border: 1px solid #ccc;
                border-radius: 4px;
                z-index:999;
                min-width:560px;
                max-width:800px;
                .operation-step-paras{
					flex:1;
					height:100%;
					max-width:800px;
					min-width: 530px;
					overflow-y:auto;
					overflow-x:hidden;
					background: #fff;
					padding:0 15px 0 10px;
					position: relative;
					.show-compute{
						height:100px;
						width: 400px;
						position: absolute;
						top:50%;
						margin-top:-80px;
						left:50%;
						margin-left:-200px;
						font-size: 20px;
					}
					.create-table{
						width:400px;
						margin:0 auto;
						padding:20px 50px 0;
						border:1px solid #ccc;
						border-radius: 4px;
					}
					.false-btn{
						margin:20px auto;
						width:200px;
						height:50px;
						line-height:50px;
						background:#409EFF;
						color:#fff;
						border-radius:3px;
						display:block;
						font-size:20px;
						font-weight:600;
						cursor: pointer;
						text-align: center;
					}
					.software-creo{
						position: absolute;
						left:80px;
						bottom:20px;
					}
					.software-nx{
						position: absolute;
						right:80px;
						bottom:20px;
					}
					.false-btn:hover{
						background:rgba(64,158,255,.9);
					}
					.s-p-btn{
						text-align: center;
						height:60px;
						line-height: 36px;
						margin-bottom: 30px;
						.false-btn{
							width:200px;
							height:50px;
							line-height:50px;
							background:#409EFF;
							color:#fff;
							border-radius:3px;
							display:inline-block;
							font-size:20px;
							font-weight:600;
							cursor: pointer;
						}
						.false-btn:hover{
							background:rgba(64,158,255,.9);
						}
						div:last-child{
							margin-left:30px;
						}
					}
					.s-p-name{
						height:50px;
						line-height: 40px;
                        text-align:left;
					}
					.operation-step-para{
						border:1px solid #ccc;
						border-radius: 4px;
						position: relative;
						padding:20px 20px;
						margin:10px 10px 30px;
						h4{
							padding:0 8px;
							height:30px;
							line-height: 30px;
							position: absolute;
							top:-15px;
							left:10px;
							background:#fff;
						}
						.cont-r{
							flex:auto;
							padding: 40px 0px 0px 15px;
							position: relative;
							font-size:12px !important;
							overflow: hidden;
							p{						
								position: absolute;
								top:0;
								height:30px;
								line-height: 30px;
								font-size: 14px;
								left:0px;
								font-weight: 600;
								input{
									width:60px;
									height: 26px;
									border-radius:4px;
									border:1px solid #dcdfe6;
								}				
							}
							.create-showForm{
								width:92%;
								.showForm-textarea{
									position: relative;
									width:100%;
									.select-label{
										position: absolute;
										top:0px;
										left:0px;
										width:55px;
									}
									.textarea-value{
										margin-left:60px;
										width:80%;
									}
								}
								.showForm-paraCheck{
									width:100%;
									position: relative;
									text-align: center;
									.paraCheck-btn1{
										position: absolute;
										top:58px;
										right: 20px;
									}
									.paraCheck-btn2{
										position: absolute;
										top:58px;
										right: 0px;
									}
									.paraCheck-h{
										padding:0 50px 0 32px;
										display: flex;
										.paraCheck-h-t{
											flex:1;
										}
									}
									.paraCheck-b{
										height:28px;
										line-height: 28px;
										display: flex;
										padding:0 50px 0 32px;
										margin:4px 0;
										position: relative;
										.paraCheck-b-t{
											position: absolute;
											left:0;
											height:26px;
											line-height: 28px;
											width: 30px;
											padding:0;
										}
										.paraCheck-b-c{
											display: inline-block;										
											margin: 0px;
											max-width:10%;
											padding:0 3px;
											border-radius:4px;
											color:#606266;
											border:1px solid #dcdfe6;
											box-sizing: border-box;
										}
									}
								}
								.showForm-itvFnc{
									width:100%;
									position: relative;
									.showForm-itvFnc-cont{
										width:100%;
									}
									.showForm-itvFnc-btn1{
										position: absolute;
										right:35px;
										top:30px;
									}
									.showForm-itvFnc-btn2{
										position: absolute;
										right:15px;
										top:30px;
									}
								}
								.showForm-select{
									position: relative;
									width:100%;
									.select-label{
										position: absolute;
										top:0px;
										left:0px;
										width:55px;
									}
									.select-list{
										margin-left:60px;
									}
									.create-showForm-item-add{
										position: absolute;
										top:32px;
										left:20px;
									}
									.create-showForm-choose-del{
										position: absolute;
										top:32px;
										right:-20px;
									}
								}
								#text2{
									width: 46%;
									margin:4px;
									padding:0 1% 0;
								}
								.create-showForm-item{
									float: left;
									position: relative;
									width: 100%;
									.create-showForm-item-btn{
										position: absolute;
										top:0;
										right:-20px;
									}
									.create-showForm-item-btn2{
										
										position: absolute;
										top:0;
										right:2px;
									}
									.create-showForm-item-input{
										position: absolute;
										top:0;
										left:-65px;
										width:60px;
										
									}
									.showForm-choose{
										position: relative;
										width:100%;
										.choose-label{
											position: absolute;
											top:0px;
											left:0px;
											width:55px;
										}
										.create-showForm-item-add{
											position: absolute;
											top:32px;
											left:20px;
										}
										.create-showForm-choose-del{
											position: absolute;
											top:1px;
											left:178px;
										}
										.create-showForm-choose{
											width:100%;
											margin-left:60px;
											
											line-height: 30px;
											.create-showForm-choose-input{
												position: absolute;
												top:2px;
												left:24px;
												height:24px;
												line-height: 24px;
												border:1px solid #dcdfe6;
												border-radius:4px;
												width:170px;
											
											}	
										}
									}
									
								}
							}
						}
					}
				}
            }
		}
		.content-views-head{
			flex:0 0 50px;
			line-height: 50px;
			padding: 0 10px 0;
			min-width:400px;
			.content-views-head-l{
				float: left;
			}
			.content-views-head-r{
				float: right;
			}
		}
    }
</style>
