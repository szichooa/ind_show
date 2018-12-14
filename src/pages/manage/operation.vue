
<template>
	<div class="content-views">
		<div class="operation-list">
			<el-menu
				:default-active="stepShowIndex"
				class="el-menu-vertical-demo"
				background-color="#222d32"
				text-color="#fff"
				active-text-color="#ffd04b">
				<div style="padding-left:30px;height:60px;line-height:60px;color:#FFF;background-color:rgb(27,36,40);border-bottom:2px solid #333;">
					<i class="el-icon-tickets" style="font-size:16px;"></i>
					<span style="font-size:16px;">&nbsp;&nbsp;业务列表</span>
				</div>
				<el-menu-item style="padding-left:45px;" v-for="item,index in operationList" :index="'1-'+index" @click="loadOperation(item,index)" :key="item.id">
					<span slot="title">{{item.workName}}</span>
				</el-menu-item>
			</el-menu>
			
		</div>
		<div class="operation-step">
			<h3>{{operationName}}</h3>
			<div class="operation-step-cont">
				<div class="operation-step-steps">
					<h4>计算步骤:</h4>
					<div class="operation-step-s-c" v-for="step,indexS in stepList" v-model="stepList" :key="indexS">
						<div class="s-c-head">
							<p class="c-num" v-if="!isSuccess[indexS]">{{indexS+1}}</p>
							<p class="c-success" v-if="isSuccess[indexS]">√</p>
							<p class="c-name" @click="stepClick(step,indexS)" v-show="!isVisited[indexS]" v-model="isVisited">{{step.stepName}}</p>
							<p class="c-name1" @click="stepClick(step,indexS)" v-show="isVisited[indexS]" v-model="isVisited">{{step.stepName}}</p>
							<div class="c-select" v-model="fncList" v-if="fncList[indexS]">
								<el-select v-model="fncShowId[indexS]" placeholder="请选择" @change="changeFnc(step,indexS)" size="mini" class="c-sec">
									<el-option v-for="para,indexL in fncList[indexS].fncItem"
									:label="para.functionName"
									:value="indexL"
									:key="para.id">
									</el-option> 
								</el-select>
							</div>
						</div>
						<div class="s-c-body" v-model="fncList" v-if="fncList[indexS]">
							<div class="s-c-paras" v-if="fncList[indexS]">
								<div class="s-c-p-item" v-for="paraM,indexP in fncList[indexS].fncItem[fncShowId[indexS]].funParas" :key="paraM.id">
									{{paraM.parpameterName}}
								</div>
							</div>
						</div>
						<div class="s-c-body1" v-model="fncList" v-if="!fncList[indexS]">
							<div class="s-c-p-item"></div>
						</div>
					</div>
				</div>
				<el-form class="operation-step-paras" v-loading="uploading" :rules="rules" :model='paraDomain'>
					<h4 class="s-p-name">{{stepShowName}}：
						<el-button type="primary" size="mini" style="float:right;margin:10px 10px 0 0;" @click="showDataTable" v-if="stepShowName!=''&&stepShowName!='设计输出'&&stepShowName!='参数信息'">导入历史数据</el-button>
					</h4>
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
								<el-form :model="showForm" size="mini" class="create-showForm" label-position="right" :rules="rules" ref="ichooa">
									<div v-for="(item, indexS) in showForm.showFormCreate" :key="indexS" class="create-showForm-item" :id="item.typeI" v-if="showForm.radioA !== '0'">
										<!-- 数字必传项 -->
										<el-form-item v-if="item.typeI === 'text'&&item.status=='0'" :label="item.labelI" label-width="220px" :prop="'showFormCreate.'+indexS+'.valueI'" :rules="rules.valueNum">
											<el-input type="text" :inline="true" style="width:50%;" v-model.number="item.valueI" placeholder="输入值"></el-input>
											<span style="width:25%;font-size:12px;" v-model="item.unitI">{{item.unitI}}</span>
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI" style="position:absolute;right:3px;line-height:30px;color:#409EFF">
												<i class="el-icon-question"></i>
											</el-tooltip>
										</el-form-item >
										<!-- 必传项 -->
										<el-form-item v-if="item.typeI === 'text'&&item.status=='1'" :label="item.labelI" label-width="220px" :prop="'showFormCreate.'+indexS+'.valueI'" :rules="rules.valueStr">
											<el-input type="text" :inline="true" style="width:50%;" v-model="item.valueI" placeholder="输入值"></el-input>
											<span style="width:25%;font-size:12px;" v-model="item.unitI">{{item.unitI}}</span>
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI" style="position:absolute;right:3px;line-height:30px;color:#409EFF">
												<i class="el-icon-question"></i>
											</el-tooltip>
										</el-form-item >
										<!-- 非必传项 -->
										<el-form-item v-if="item.typeI === 'text'&&item.status=='2'" :label="item.labelI" label-width="220px">
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
										<el-form-item :inline="true"  v-if="item.typeI === 'text2'&&item.status=='0'" label-width="50%" :label="item.labelI" :prop="'showFormCreate.'+indexS+'.valueI'" :rules="rules.valueNum">									
											<el-input :inline="true" style="width:50%" v-model.number="item.valueI" placeholder="输入值"></el-input>
											<span style="width:45%;display:inline-block;font-size:12px;" v-model="item.unitI">{{item.unitI}}</span>
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI" style="position:absolute;right:-20px;top:1px;line-height:30px;color:#409EFF">
												<i class="el-icon-question"></i>
											</el-tooltip>
										</el-form-item>
										<el-form-item :inline="true"  v-if="item.typeI === 'text2'&&item.status=='1'" label-width="50%" :label="item.labelI" :prop="'showFormCreate.'+indexS+'.valueI'" :rules="rules.valueStr">									
											<el-input :inline="true" style="width:50%" v-model.number="item.valueI" placeholder="输入值"></el-input>
											<span style="width:45%;display:inline-block;font-size:12px;" v-model="item.unitI">{{item.unitI}}</span>
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI" style="position:absolute;right:-20px;top:1px;line-height:30px;color:#409EFF">
												<i class="el-icon-question"></i>
											</el-tooltip>
										</el-form-item>
										<el-form-item :inline="true"  v-if="item.typeI === 'text2'&&item.status=='2'" label-width="50%" :label="item.labelI">									
											<el-input :inline="true" style="width:50%" v-model.number="item.valueI" placeholder="输入值"></el-input>
											<span style="width:45%;display:inline-block;font-size:12px;" v-model="item.unitI">{{item.unitI}}</span>
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI" style="position:absolute;right:-20px;top:1px;line-height:30px;color:#409EFF">
												<i class="el-icon-question"></i>
											</el-tooltip>
										</el-form-item>
										<!--  图片 -->
										<el-form-item v-if="item.typeI === 'img'" style="text-align:center;">
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI">
												<img v-if="item.imageUrl" :src="downLoadImgBaseUrl+item.imageUrl" alt="" @click="showImgR(item)" style="display:inline-block;max-width:80%;max-height:200px;border:1px dashed #ccc;">
												<img src="" alt="示例图片" v-if="!item.imageUrl" width="120" height="80" style="border:1px dashed #ccc;display:inline-block;">
											</el-tooltip>
											<div v-if="!item.describleI">
												<img v-if="item.imageUrl" :src="downLoadImgBaseUrl+item.imageUrl" alt="" @click="showImgR(item)" style="background:#eee;display:inline-block;max-width:80%;max-height:200px;border:1px dashed #ccc;">
												<img src="" alt="示例图片" v-if="!item.imageUrl" width="120" height="80" style="border:1px dashed #ccc;display:inline-block;">	
											</div>
										</el-form-item >
										<!--  区间文本-->
										<el-form-item v-if="item.typeI === 'text1'&&item.status=='0'" label-width="220px" :label="item.labelI" :prop="'showFormCreate.'+indexS+'.valueI'" :rules="rules.valueNum">
											<el-input :inline="true" style="width:33%;" v-model.number="item.valueI" placeholder="区间值1"></el-input>
											<span>-</span>
											<el-input :inline="true" style="width:33%;" v-model.number="item.valueI2" placeholder="区间值2"></el-input>										
											<span style="width:15%;font-size:12px;" v-model="item.unitI">{{item.unitI}}</span>
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI" style="position:absolute;right:3px;line-height:30px;color:#409EFF">
												<i class="el-icon-question"></i>
											</el-tooltip>
										</el-form-item >
										<el-form-item v-if="item.typeI === 'text1'&&item.status=='1'" label-width="220px" :label="item.labelI" :prop="'showFormCreate.'+indexS+'.valueI'" :rules="rules.valueStr">
											<el-input :inline="true" style="width:33%;" v-model.number="item.valueI" placeholder="区间值1"></el-input>
											<span>-</span>
											<el-input :inline="true" style="width:33%;" v-model.number="item.valueI2" placeholder="区间值2"></el-input>										
											<span style="width:15%;font-size:12px;" v-model="item.unitI">{{item.unitI}}</span>
											<el-tooltip effect="light" :content="item.describleI" placement="top-end" v-if="item.describleI" style="position:absolute;right:3px;line-height:30px;color:#409EFF">
												<i class="el-icon-question"></i>
											</el-tooltip>
										</el-form-item >
										<el-form-item v-if="item.typeI === 'text1'&&item.status=='2'" label-width="220px" :label="item.labelI">
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
										<el-form-item v-if="item.typeI === 'checkbox'" label-width="75px" v-loading="uploadingA" :label="item.labelI" style="border:1px solid #ccc;padding:20px 20px 10px 0;border-radius:4px;">
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
													<img :src="downLoadImgBaseUrl+para.imageUrl" alt="" v-if="para.typeL==='img'&&para.imageUrl" @click="showImgR(para)" style="border:1px dashed #ccc;max-width:80%;max-height:200px;">
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
													<el-input v-if="para.typeL==='uploadBtn'" :inline="true" style="width:40%;margin-left:30%;" disabled v-model="para.valueL" placeholder="值"></el-input>
													<el-upload
													v-if="para.typeL==='uploadBtn'"
													class="avatar-uploader"
													:action="uploadUrl"
													:show-file-list="false"
													:on-success="handleAvatarSuccess"
													:on-error="handleAvatarError"
													:before-upload="beforeUpload">
														<el-button :inline="true" v-if="para.typeL==='uploadBtn'" size="mini" type="primary" @click="saveItemIndex(indexZ,indexA,indexS,indexL)" style="position:absolute;right:0;top:0;">读取</el-button>
													</el-upload>
													<el-button v-if="para.typeL==='uploadBtn'&&para.unitL!=''" size="mini" type="text" @click="showUpload(para)" style="position:absolute;right:0;top:32px;">查看载荷信息</el-button>
												</el-checkbox>								
											</el-checkbox-group>								
										</el-form-item >		
										<!--  单选框-->
										<el-form-item v-if="item.typeI === 'radio'" v-loading="uploadingA" :label="item.labelI" style="border:1px solid #ccc;padding:10px 10px 10px 0;border-radius:4px;">	
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
													<img :src="downLoadImgBaseUrl+para.imageUrl" alt="图片示例" v-if="para.typeL==='img'" @click="showImgR(para)" style="border:1px dashed #ccc;max-width:80%;max-height:200px;">
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
													:on-success="handleAvatarSuccess"
													:on-error="handleAvatarError"
													:before-upload="beforeUpload">
														<el-button :inline="true" v-if="para.typeL==='uploadBtn'" size="mini" type="primary" @click="saveItemIndex(indexZ,indexA,indexS,indexL)" style="position:absolute;right:0;top:0;">读取</el-button>
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
											<el-button type="text" @click="addFncList(fnc,indexA,indexS,indexZ)" class="showForm-itvFnc-btn1" icon="el-icon-circle-plus-outline"></el-button>
											<el-button type="text" @click="delFncListF(fnc,indexA,indexS,indexZ)" class="showForm-itvFnc-btn2" icon="el-icon-remove-outline"></el-button>	
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
											<el-button type="text" @click="addFncList(fnc,indexA,indexS,indexZ)" class="paraCheck-btn1" icon="el-icon-circle-plus-outline"></el-button>
											<el-button type="text" @click="delFncList(fnc,indexA,indexS,indexZ)" class="paraCheck-btn2" icon="el-icon-remove-outline"></el-button>
										</el-form-item>
									</div>
									<!--否选项-->
									<div v-for="(item, indexS) in showForm.showFormCreateN" :key="indexS" class="create-showForm-item" :id="item.typeI" v-if="showForm.radioA === '0'">
										<el-form-item v-if="item.typeI === 'img'" style="text-align:center;">
											<img v-if="item.imageUrl" :src="downLoadImgBaseUrl+item.imageUrl" @click="showImgR(item)" alt="示例图片" style="display:inline-block;max-width:80%;max-height:200px;border:1px dashed #ccc;">
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
											<el-button type="text" @click="addFncList(fnc,indexA,indexS,indexZ)" class="showForm-itvFnc-btn1" icon="el-icon-circle-plus-outline"></el-button>
											<el-button type="text" @click="delFncListF(fnc,indexA,indexS,indexZ)" class="showForm-itvFnc-btn2" icon="el-icon-remove-outline"></el-button>	
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
											<el-button type="text" @click="addFncList(fnc,indexA,indexS,indexZ)" class="paraCheck-btn1" icon="el-icon-circle-plus-outline"></el-button>
											<el-button type="text" @click="delFncList(fnc,indexA,indexS,indexZ)" class="paraCheck-btn2" icon="el-icon-remove-outline"></el-button>
										</el-form-item>
									</div>
								</el-form>
							</div>
						</div>
					</div>
					<el-form class="create-table" v-if="false">
						<h4>数据分析</h4>
						<el-form-item label="输入数据" label-width="120px">
							<el-select v-model="onClickList.inputData" placeholder="请选择" size="mini" class="c-sec">
								<el-option v-for="para,index in dataRelationList.inputData"
								:label="para.label"
								:value="index"
								:key="para.id">
								</el-option> 
							</el-select>
						</el-form-item>
						<el-form-item label="结果数据" label-width="120px">
							<el-select v-model="onClickList.resultData" placeholder="请选择" size="mini" class="c-sec">
								<el-option v-for="para,index in dataRelationList.resultData"
								:label="para.label"
								:value="index"
								:key="para.id">
								</el-option> 
							</el-select>
						</el-form-item>
						<el-form-item label="最近计算次数" label-width="120px">
							<el-input v-model.number="onClickList.logLength" size="mini" style="width:183px;"></el-input>
						</el-form-item>
						<el-form-item label-width="150px" style="text-align:left;">
							<el-button @click="getUselogCompare()" type="primary" size="small">生成数据图表</el-button>
						</el-form-item>
					</el-form>
					<!-- <div class="false-btn" @click="downLoadReport" v-if="downLoadBtn&&stepShowName=='设计输出'&&showCompareImg">查看图表</div> -->
					<div class="false-btn" @click="downLoadReport" v-if="downLoadBtn&&stepShowName=='设计输出'">下载报告</div>
					<div class="callbutton" v-if="stepShowName=='设计输出'" style="text-align:center;">
						<el-button @click="callSoftCore" v-if="stepShowName=='设计输出'">启动Creo</el-button>
						<el-button @click="callSoftNX" v-if="stepShowName=='设计输出'">启动NX</el-button>
					</div>
					
					<div class="show-compute" v-if="!downLoadBtn&&stepShowName=='参数信息'">
						请点击左侧步骤按钮，按顺序完成计算操作
					</div>
					<div class="show-compute" v-if="!downLoadBtn&&stepShowName=='设计输出'">
						请先按顺序完成计算步骤，然后查看计算结果
					</div>
					<div class="s-p-btn" v-if="paraShowList">
						<div class="false-btn" @click="fncCompute('showForm')" v-if="paraShowList.length!=0&&stepIndex==0">上传载荷</div>
						<div class="false-btn" @click="fncCompute" v-if="paraShowList.length!=0&&stepIndex!=0">函数计算</div>
					</div>
				</el-form>
			</div>
			<div class="operation-step-result">
				<h4>结果展示:</h4>
				<div class="operation-step-result-cont">
					<div class="result-textarea" v-model="resultShow" v-html="resultShow">
					</div>
					<el-button type="primary" class="result-btn1" size="small" @click="toResult">查看结果详情</el-button>
					<!-- <div class="result-btn1" @click="toResult">
						查看详情
					</div> -->
				</div>
			</div>
			<div class="table-show" v-if="tableIsShow">
				<div class="charts" style="position:relative;">
					<tableShow></tableShow>
					<el-button type="text" @click="closeTableShow" style="font-size:20px; position:absolute;right:20px;top:5px;"><i class="el-icon-circle-close-outline"></i></el-button>
				</div>
			</div>
			<div class="data-show" v-if="dataIsShow">
				<dataShow></dataShow>
				<el-button type="text" @click="closeDataShow" style="font-size:16px; position:absolute;right:20px;top:10px;color:#f56c6c;"><i class="el-icon-circle-close-outline"></i></el-button>
				<el-button type="primary" size="mini" style="position:absolute;right:115px;bottom:25px;" @click="inputDataShow">应用</el-button>
				<el-button type="danger" size="mini" style="position:absolute;right:35px;bottom:25px;" @click="closeDataShow">返回</el-button>
			</div>
		</div>
		<div class="result-show" v-if="showResultCont">
			<div class="result-detial">
				<h4>结果详情:</h4>
				<div class="result-cont" v-html="resultShow"></div>
				<div class="download">
					<el-button type="primary" @click="downLoadReport">下载报告</el-button>
					<el-button type="" @click="backOpe">返回计算</el-button>
				</div>
			</div>
		</div>
		<div class="computing" v-if="loadingA">
			<div class="computing-title" v-if="!gameShow">
				<i class="el-icon-loading" style="font-size:130px;color:#409EFF;"></i>
				<br><br>
				<span>函数计算中，这可能会需要一段时间才能计算完成，请耐心等待……</span>
				<br><br><br>
				<!-- <el-button type="primary" size="small" @click="showGameToPlay">玩个小游戏提提神</el-button> -->
			</div>
			<div class="computing-title1" v-if="gameShow">
				<i class="el-icon-loading" style="font-size:130px;color:#409EFF;"></i>
				<br><br><br>
				<span>函数计算中，请耐心等待……</span>
			</div>
			<div class="little-game" v-if="gameShow">
				<div class="game-name">
					亮灯小能手
				</div>
				<div class="game-box" v-for="box,index in gameList" @click="changeColor(index)" :key="index">
					<div class="game-boxW" v-if="box.white" :key="index"></div>
					<div class="game-boxB" v-if="!box.white" :key="index"></div>
				</div>
				<div class="game-introduction">
					<h4>游戏介绍</h4>
					<p>
						1、使用鼠标操作；<br><br>
						2、点击灯泡，该灯泡和其上下左右四个灯泡同时变换状态（如为开启状态，则变为关闭状态;如为关闭状态，则变为开启状态。）<br><br>
						3、合理操作将所有的灯都点亮即为胜利。
					</p>
				</div>
				<div class="game-btn">
					<el-button @click="nextGame()" size="mini">下一关</el-button>
					<el-button @click="prevGame()" size="mini">上一关</el-button>
				</div>
				<div class="game-close" @click="closeGame">
					关闭&nbsp;X
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
	import tableShow from "../../common/tableShow.vue";
	import dataShow from "../../common/dataShow.vue";
	import Echarts from 'echarts';
	import { addHistoryPara,getWorkList,getWorkStepList,getModelFncParaList,getModelFncParaShow,ossDownBaseURL_g,funCallBackFun,ossBaseURL_g,callSoftware,getFncComParaList,getFncComParaData } from '../../api/api';
	export default {
		components: {
			tableShow,
			dataShow
		},
		methods: {
			showUpload(para){
				let downloadReportURL=this.downLoadImgBaseUrl+para.unitL
				window.open(downloadReportURL, '_blank')
			},
			showImgR(item){
				let downloadReportURL=this.downLoadImgBaseUrl+item.imageUrl
				window.open(downloadReportURL, '_blank')
			},
			initChart() {
				var myChart=document.getElementById('myChart')
               	var mainChart = echarts.init(myChart)
				mainChart.setOption(this.option, true)
			},
			inputDataShow(){
				this.paraShowList=this.$store.state.changeTableDataShow;
				this.dataIsShow=false;
			},
			closeDataShow(){
				this.dataIsShow=false;
			},
			showDataTable(){
				this.dataIsShow=true;
				this.$store.commit('myChangeFunDataParaID',this.functionId)
			},
			closeTableShow(){
				this.tableIsShow=false;
			},
			getUselogCompare(){
				getFncComParaData(window.sessionStorage.ApiUrl,{
					'token':window.localStorage.adminToken,
					'fun_id':this.functionId,
					'in_para':this.dataRelationList.inputData[this.onClickList.inputData].value,
					're_para':this.dataRelationList.resultData[this.onClickList.resultData].value,
					'log_length':this.onClickList.logLength
				}).then(res=>{
					if(res.data.status==200){
						var tableShowD=res.data.data
						this.tableShowData.xTable=tableShowD.map(t=>t[0])
						this.tableShowData.yTable=tableShowD.map(t=>t[1])
						this.tableShowData.xName=this.dataRelationList.inputData[this.onClickList.inputData].label
						this.tableShowData.yName=this.dataRelationList.resultData[this.onClickList.resultData].label
						this.tableIsShow=true;
						this.$store.commit('comTableShowData',this.tableShowData)
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
							message: '加载失败,请检查网络!'
						});	
					}
				}).catch()
			},
			callSoftCore(){
				callSoftware(window.sessionStorage.ApiUrl,{
					'exe_name':'creo',
					'token':window.localStorage.adminToken
				}).then(res=>{
					if(res.data.status==200){
						this.$message({
							type: 'success',
							message: '启动成功'
						});	
					}else if(res.data.status == 201){
						this.$message({
							type: 'info',
							message: 'token失效，为保障账户安全，请重新登陆'
						});						 
						window.localStorage.clear()
						window.window.sessionStorage.setItem('isLogin','0')
						this.$router.push('/login'); 
						this.loadingA=false;
					}else{
						this.$message.error({
						message: '启动失败',
						showClose: false
						});
					}
				}).catch(err=>{
					this.$message.error({
						message: '启动失败',
						showClose: false
					});
				})
			},
			callSoftNX(){
				callSoftware(window.sessionStorage.ApiUrl,{
					'exe_name':'nx',
					'token':window.localStorage.adminToken
				}).then(res=>{
					if(res.data.status==200){
						this.$message({
							type: 'success',
							message: '启动成功'
						});	
					}else if(res.data.status == 201){
						this.$message({
							type: 'info',
							message: 'token失效，为保障账户安全，请重新登陆'
						});						 
						window.localStorage.clear()
						window.window.sessionStorage.setItem('isLogin','0')
						this.$router.push('/login'); 
						this.loadingA=false;
					}else{
						this.$message.error({
						message: '启动失败',
						showClose: false
						});
					}
				}).catch(err=>{
					this.$message.error({
						message: '启动失败',
						showClose: false
					});
				})
			},
			backOpe(){
				this.showResultCont=false;
			},
			toResult(){
				if(this.resultShow){
					this.showResultCont=true
				}else{
					this.$message({
						type: 'error',
						message: '请先完成计算，然后再查看结果'
					});
				}
			},
			downLoadReport(){
				let downloadReportURL=this.downLoadImgBaseUrl+this.downLoadReportURL;
				if(this.downLoadReportURL==""){
					this.$message({
						type: 'error',
						message: '报告文件生成失败，请重新计算！'
					});
				}else{
					window.open(downloadReportURL, '_blank')
				}
			},
			beforeUpload(){
				this.uploadingA=true
			},
			saveItemIndex(indexZ,indexA,indexS,indexL){
				this.itemIndexA=indexA
				this.itemIndexZ=indexZ
				this.itemIndexS=indexS
				this.itemIndexL=indexL
				this.paraValueList.file=true
			},
			handleAvatarError(err){
				this.$message({
					type: 'error',
					message: '读取失败，请重试！'
				});
				this.uploadingA=false
			},
			handleAvatarSuccess(response,file){
				this.$message({
					type: 'success',
					message: '读取成功'
				});	
				this.uploadingA=false
				this.paraShowList[this.itemIndexZ].funParaDesc[this.itemIndexA].showFormCreate[this.itemIndexS].valueForm[this.itemIndexL].unitL=response.data.all_path
				this.paraShowList[this.itemIndexZ].funParaDesc[this.itemIndexA].showFormCreate[this.itemIndexS].valueForm[this.itemIndexL].valueL='file:'+response.data.all_path
			},
			aleartMessage(){
				this.$message({
					type: 'info',
					message: '请确认内容是否全部填写正确'
				});
			},
			addHistoryParaNow(){
				var params = new URLSearchParams();
						params.append('token', window.localStorage.adminToken);
						params.append('fun_id',this.functionId);
						params.append('fun_name',this.functionName);
						params.append('user_id',window.localStorage.adminId);
						params.append('fun_para',JSON.stringify(this.paraShowList));
					addHistoryPara(window.sessionStorage.ApiUrl,params).then(res=>{
						if(res.data.status==200){
							
						}else if(res.data.status == 201){
							this.$message({
								type: 'info',
								message: 'token失效，为保障账户安全，请重新登陆'
							});						 
							window.localStorage.clear()
							window.window.sessionStorage.setItem('isLogin','0')
							this.$router.push('/login'); 
						} else if(res.data.status==300){
							this.$message.error({
								message: '保存计算数据失败！',
								showClose: false
							});
						}else if(res.data.status==400){
							this.$message.error({
								message: '保存计算数据失败！',
								showClose: false
							});
						}else if(res.data.status==401){
							this.$message.error({
								message: '401 ERROR',
								showClose: false
							});
						}else if(res.data.status==500){
							this.$message.error({
								message: '保存计算数据失败！',
								showClose: false
							});
						}else{
							this.$message.error({
								message: '请检查网络',
								showClose: false
							});
						}
					}).catch(err=>{
						this.$message.error({
							message: '请检查网络',
							showClose: false
						});
					})
			},
			axiosFncCom(){
				this.loadingA=true;
				var paraV1=[];
				paraV1=this.paraShowList.map(function(itemH,indexH){
					if(itemH.funParaDesc.length==0){
						var valueList=[];
					}else{
						var valueList2=itemH.funParaDesc.map(function(itemJ,indexJ,listJ){
							if(itemJ.typeA=="special"&&itemJ.radioA=="1"){
								var valueList4=itemJ.showFormCreate.map(function(itemK,indexK,list){
									if(itemK.typeI=="paraCheck"){
										var valueList5=itemK.valueI.map(value=>[value.valueI1,value.valueI2,value.valueI3,value.valueI4,value.valueI5,value.valueI6,value.valueI7,value.valueI8,value.valueI9,value.valueI10])
									}else if(itemK.typeI=="itvFnc"){
										valueList5=itemK.valueI.map(value=>[value.valueI1,value.valueI2,value.valueI3])
									}else if(itemK.typeI=="img"){
										valueList5=null
									}
									return valueList5
								})
								var valueList5=itemJ.showFormCreateN.map(function(itemK,indexK,list){
									if(itemK.typeI=="paraCheck"){
										var valueList5=itemK.valueI.map(value=>[value.valueI1,value.valueI2,value.valueI3,value.valueI4,value.valueI5,value.valueI6,value.valueI7,value.valueI8,value.valueI9,value.valueI10])
									}else if(itemK.typeI=="itvFnc"){
										valueList5=itemK.valueI.map(value=>[value.valueI1,value.valueI2,value.valueI3])
									}else if(itemK.typeI=="img"){
										valueList5=null
									}
									return valueList5
								})
								valueList4=valueList4.filter(t => t!=undefined && t!==null);
								valueList5=valueList5.filter(t => t!=undefined && t!==null);
								var valueList3=[
									[1,valueList4],
									[0,valueList5]
								]
							}else if(itemJ.typeA=="special"&&itemJ.radioA=="0"){
								var valueList4=itemJ.showFormCreate.map(function(itemK,indexK,list){
									if(itemK.typeI=="paraCheck"){
										var valueList5=itemK.valueI.map(value=>[value.valueI1,value.valueI2,value.valueI3,value.valueI4,value.valueI5,value.valueI6,value.valueI7,value.valueI8,value.valueI9,value.valueI10])
									}else if(itemK.typeI=="itvFnc"){
										valueList5=itemK.valueI.map(value=>[value.valueI1,value.valueI2,value.valueI3])
									}else if(itemK.typeI=="img"){
										valueList5=null
									}
									return valueList5
								})
								var valueList5=itemJ.showFormCreateN.map(function(itemK,indexK,list){
									if(itemK.typeI=="paraCheck"){
										var valueList5=itemK.valueI.map(value=>[value.valueI1,value.valueI2,value.valueI3,value.valueI4,value.valueI5,value.valueI6,value.valueI7,value.valueI8,value.valueI9,value.valueI10])
									}else if(itemK.typeI=="itvFnc"){
										valueList5=itemK.valueI.map(value=>[value.valueI1,value.valueI2,value.valueI3])
									}else if(itemK.typeI=="img"){
										valueList5=null
									}
									return valueList5
								})
								valueList4=valueList4.filter(t => t!=undefined && t!==null);
								valueList5=valueList5.filter(t => t!=undefined && t!==null);
								var valueList3=[
									[0,valueList4],
									[1,valueList5]
								]
							}else{
								if(itemJ.showFormCreate.length==1){
									var valueList4=itemJ.showFormCreate.map(function(itemK,indexK){
										if(itemK.typeI=="img"){
											var valueList6=null;
										}else if(itemK.typeI=="radio"){
											var valueList6=itemK.valueForm.map(function(itemM,indexM){
												if(itemM.typeL=="textDes"){
													var valueList7=itemM.listL.map(function(itemN){
														if(itemN.valueD==''){
															return 0
														}else{
															return itemN.valueD
														}
													})
												}else if(itemM.typeL=="uploadBtn"){
													valueList7=itemM.valueL
												}else{
													valueList7=[0,0]
												}
												return [0,valueList7]
											})
											var numCheck=parseInt(itemK.valueI)
											valueList6[numCheck][0]=1
										}else if(itemK.typeI=="checkbox"){
											var valueList6=itemK.valueForm.map(function(itemM,indexM){
												if(itemM.typeL=="textDes"){
													var valueList7=itemM.listL.map(function(itemN){
														if(itemN.valueD==''){
															return 0
														}else{
															return itemN.valueD
														}
													})
												}else if(itemM.typeL=="uploadBtn"){
													valueList7=itemM.valueL
												}else{
													valueList7=[0,0]
												}
												return [0,valueList7]
											})
											var numCheckList=itemK.valueI.map(intT=>parseInt(intT))
											for(var j in itemK.valueI){
												valueList6[itemK.valueI[j]][0]=1
											}
										}else if(itemK.typeI=="select"){
											var valueList6=itemK.valueForm.map(function(itemM){
												if(itemK.valueI==itemM.labelL){
													return [1,[parseFloat(itemM.labelL),itemM.labelL]]
												}else{
													return [0,[parseFloat(itemM.labelL),itemM.labelL]]
												}
											})
										}else if(itemK.typeI=="text1"){
											valueList6=[itemK.valueI,itemK.valueI2]
										}else if(itemK.typeI=="itvFnc"){
											valueList6=itemK.valueI.map(value=>[value.valueI1,value.valueI2,value.valueI3])
										}else{
											valueList6=itemK.valueI
										}
										return valueList6
									})
									valueList4=valueList4.filter(t => t!=undefined && t!==null);
									//valueList3=valueList4[0]
									valueList3=valueList4
								}else if(itemJ.showFormCreate.length>1){
									var valueList4=itemJ.showFormCreate.map(function(itemK,indexK){
										if(itemK.typeI=="img"){
											var valueList6=null;
										}else if(itemK.typeI=="radio"){
											var valueList6=itemK.valueForm.map(function(itemM,indexM){
												if(itemM.typeL=="textDes"){
													var valueList7=itemM.listL.map(function(itemN){
														var valueList8
														if(itemN.valueL==''){
															valueList8=0
														}else{
															valueList8=itemN.valueL
														}
														return valueList8;
													})
												}else{
													valueList7=[0,0]
												}
												return [0,valueList7]
											})
											var numCheck=parseInt(itemK.valueI)
											valueList6[numCheck][0]=1
										}else if(itemK.typeI=="checkbox"){
											var valueList6=itemK.valueForm.map(function(itemM,indexM){
												if(itemM.typeL=="textDes"){
													var valueList7=itemM.listL.map(function(itemN){
														if(itemN.valueD==''){
															return 0
														}else{
															return itemN.valueD
														}
													})
												}else{
													valueList7=[0,0]
												}
												return [0,valueList7]
											})
											var numCheckList=itemK.valueI.map(intT=>parseInt(intT))
											for(var j in itemK.valueI){
												valueList6[itemK.valueI[j]][0]=1
											}
										}else if(itemK.typeI=="select"){
											var valueList6=itemK.valueForm.map(function(itemM){
												if(itemK.valueI==itemM.labelL){
													return [1,[parseFloat(itemM.labelL),itemM.labelL]]
												}else{
													return [0,[parseFloat(itemM.labelL),itemM.labelL]]
												}
											})
										}else if(itemK.typeI=="text1"){
											valueList6=[itemK.valueI,itemK.valueI2]
										}else if(itemK.typeI=="text1D"){
											valueList6=[itemK.valueI,itemK.valueI2]
										}else if(itemK.typeI=="itvFnc"){
											valueList6=itemK.valueI.map(value=>[value.valueI1,value.valueI2,value.valueI3])
										}else{
											valueList6=itemK.valueI
										}
										return valueList6
									})
									valueList4=valueList4.filter(t => t!=undefined && t!==null);
									valueList3=valueList4
								}
							}
							return valueList3
						})
						if(valueList2.length==1){
							// valueList2=valueList2[0]
						}
						valueList=valueList2
					}
					return valueList
				})
				//paraV1=paraV1.filter(t => t!=undefined && t!==null);
				paraV1=paraV1.map(t =>{
					if(t==null){
						return []
					}else{
						return t
					} 
				});
				if(this.stepIndex==0){
					this.paraValueList.paras=paraV1;
					this.paraValueList.file=true;
					var params = new URLSearchParams();
						params.append('token', window.localStorage.adminToken);
						params.append('fun_id',this.functionId);
						params.append('work_id',this.workID);
						params.append('work_step_id',this.itemID);
						params.append('fun_url',this.downLoadImgBaseUrl+this.functionUrl);
						params.append('fun_paras',JSON.stringify(this.paraValueList));
					funCallBackFun(window.sessionStorage.ApiUrl,params).then(res=>{
						if(res.data.status==200){
							this.resultFirst=JSON.parse(res.data.data.result)
							window.localStorage.setItem('computeResult',JSON.stringify(this.resultFirst))
							window.localStorage.setItem('computeResultShow',JSON.stringify(this.resultShow))
							this.stepClick(this.stepList[this.stepIndex+1],this.stepIndex+1);                           //调用下一步骤
							this.downLoadReportURL=res.data.data.reportPath
							if(this.stepIndex==0){
								this.downLoadBtn=false
							}else{
								this.downLoadBtn=true
							}
							this.$message({
								type: 'success',
								message: '上传载荷成功'
							});
							this.loadingA=false;
						}else if(res.data.status == 201){
							this.$message({
								type: 'info',
								message: 'token失效，为保障账户安全，请重新登陆'
							});						 
							window.localStorage.clear()
							window.window.sessionStorage.setItem('isLogin','0')
							this.$router.push('/login'); 
							this.loadingA=false;
						} else if(res.data.status==300){
							this.$message.error({
								message: '加载失败',
								showClose: false
							});
							this.loadingA=false;
						}else if(res.data.status==400){
							this.$message.error({
								message: '加载失败',
								showClose: false
							});
							this.loadingA=false;
						}else if(res.data.status==401){
							this.$message.error({
								message: '401 ERROR',
								showClose: false
							});
							
							this.loadingA=false;
						}else if(res.data.status==500){
							this.$message.error({
								message: '加载失败',
								showClose: false
							});
							this.loadingA=false;
						}else{
							this.$message.error({
								message: '请检查网络',
								showClose: false
							});
							this.loadingA=false;
						}
					}).catch(err=>{
						this.$message.error({
							message: '请检查网络',
							showClose: false
						});
						this.loadingA=false;
					})
				}else if(this.stepIndex!=0&&this.resultFirst){
					this.paraValueList.paras=paraV1.concat(this.resultFirst);
					this.paraValueList.file=false;
					var params = new URLSearchParams();
						params.append('token', window.localStorage.adminToken);
						params.append('fun_id',this.functionId);
						params.append('work_id',this.workID);
						params.append('work_step_id',this.itemID);
						params.append('fun_url',this.downLoadImgBaseUrl+this.functionUrl);
						params.append('fun_paras',JSON.stringify(this.paraValueList));
					funCallBackFun(window.sessionStorage.ApiUrl,params).then(res=>{
						if(res.data.status==200){
							this.resultShow=JSON.parse(res.data.data.result).join(`,<br><hr><br>`)
							window.localStorage.setItem('computeResultShow',JSON.stringify(this.resultFirst))
							this.stepClick(this.stepList[(this.stepIndex+1)],this.stepIndex+1)                          //调用下一步骤
							this.downLoadReportURL=res.data.data.reportPath
							this.downLoadBtn=true
							this.$message({
								type: 'success',
								message: '计算完成'
							});
							this.showResultCont=true;
							this.loadingA=false;
						}else if(res.data.status == 201){
							this.$message({
								type: 'info',
								message: 'token失效，为保障账户安全，请重新登陆'
							});						 
							window.localStorage.clear()
							window.window.sessionStorage.setItem('isLogin','0')
							this.$router.push('/login'); 
							this.loadingA=false;
						} else if(res.data.status==300){
							this.$message.error({
								message: '加载失败',
								showClose: false
							});
							this.loadingA=false;
						}else if(res.data.status==400){
							this.$message.error({
								message: '加载失败',
								showClose: false
							});
							this.loadingA=false;
						}else if(res.data.status==401){
							this.$message.error({
								message: '401 ERROR',
								showClose: false
							});
							
							this.loadingA=false;
						}else if(res.data.status==500){
							this.$message.error({
								message: '加载失败',
								showClose: false
							});
							this.loadingA=false;
						}else{
							this.$message.error({
								message: '请检查网络',
								showClose: false
							});
							this.loadingA=false;
						}
					}).catch(err=>{
						this.$message.error({
							message: '请检查网络',
							showClose: false
						});
						this.loadingA=false;
					})
				}else{
					this.$message({
						type: 'info',
						message: '未获取到首步计算信息，请重新计算第一步！'
					});		
					this.loadingA=false;
				}
		
			},
			fncCompute(){
				var indexV=this.$refs['ichooa'].length;
				var formVali=this.$refs['ichooa']
				var that=this;
				function textFormNow(num){
					var numN=num;
					formVali[numN].validate((valid) => {
						if (valid) {
							if(numN<indexV-1){
								textFormNow(numN+1)
							}else if(numN==indexV-1){
								that.addHistoryParaNow();
								that.axiosFncCom();
							}
						} else {
							that.aleartMessage()
						}
					});
				};
				textFormNow(0);
			},
			//特殊函数
			addFncList(fnc,indexA,indexS,indexZ){
				if(this.paraShowList[indexZ].funParaDesc[indexA].radioA=="1"){
					if(this.paraShowList[indexZ].funParaDesc[indexA].showFormCreate[indexS].valueI.length<5){
						this.paraShowList[indexZ].funParaDesc[indexA].showFormCreate[indexS].valueI.push({
							valueI1:'',
							valueI2:'',
							valueI3:'',
							valueI4:'',
							valueI5:'',
							valueI6:'',
							valueI7:'',
							valueI8:'',
							valueI9:'',
							valueI10:'',
							describleI:'',
							labelI:this.paraShowList[indexZ].funParaDesc[indexA].showFormCreate[indexS].valueI[0].labelI
						})
					}
				}else if(this.paraShowList[indexZ].funParaDesc[indexA].radioA=="0"){
					if(this.paraShowList[indexZ].funParaDesc[indexA].showFormCreateN[indexS].valueI.length<5){
						this.paraShowList[indexZ].funParaDesc[indexA].showFormCreateN[indexS].valueI.push({
							valueI1:'',
							valueI2:'',
							valueI3:'',
							valueI4:'',
							valueI5:'',
							valueI6:'',
							valueI7:'',
							valueI8:'',
							valueI9:'',
							valueI10:'',
							describleI:'',
							labelI:this.paraShowList[indexZ].funParaDesc[indexA].showFormCreate[indexS].valueI[0].labelI
						})
					}
				}else{
					if(this.paraShowList[indexZ].funParaDesc[indexA].showFormCreate[indexS].valueI.length<5){
						this.paraShowList[indexZ].funParaDesc[indexA].showFormCreate[indexS].valueI.push({
							valueI1:'',
							valueI2:'',
							valueI3:'',
							valueI4:'',
							valueI5:'',
							valueI6:'',
							valueI7:'',
							valueI8:'',
							valueI9:'',
							valueI10:'',
							describleI:'',
							labelI:this.paraShowList[indexZ].funParaDesc[indexA].showFormCreate[indexS].valueI[0].labelI
						})
					}
				}
			},
			delFncListF(fnc,indexA,indexS,indexZ){
				if(this.paraShowList[indexZ].funParaDesc[indexA].radioA=="1"){
					if(this.paraShowList[indexZ].funParaDesc[indexA].showFormCreate[indexS].valueI.length>1){
						this.paraShowList[indexZ].funParaDesc[indexA].showFormCreate[indexS].valueI.pop()
					}
				}else if(this.paraShowList[indexZ].funParaDesc[indexA].radioA=="0"){
					if(this.paraShowList[indexZ].funParaDesc[indexA].showFormCreateN[indexS].valueI.length>1){
						this.paraShowList[indexZ].funParaDesc[indexA].showFormCreateN[indexS].valueI.pop()
					}
				}else{
					if(this.paraShowList[indexZ].funParaDesc[indexA].showFormCreate[indexS].valueI.length>1){
						this.paraShowList[indexZ].funParaDesc[indexA].showFormCreate[indexS].valueI.pop()
					}
				}
			},
			delFncList(fnc,indexA,indexS,indexZ){
				if(this.paraShowList[indexZ].funParaDesc[indexA].radioA=="1"){
					if(this.paraShowList[indexZ].funParaDesc[indexA].showFormCreate[indexS].valueI.length>2){
						this.paraShowList[indexZ].funParaDesc[indexA].showFormCreate[indexS].valueI.pop()
					}
				}else if(this.paraShowList[indexZ].funParaDesc[indexA].radioA=="0"){
					if(this.paraShowList[indexZ].funParaDesc[indexA].showFormCreateN[indexS].valueI.length>2){
						this.paraShowList[indexZ].funParaDesc[indexA].showFormCreateN[indexS].valueI.pop()
					}
				}else{
					if(this.paraShowList[indexZ].funParaDesc[indexA].showFormCreate[indexS].valueI.length>2){
						this.paraShowList[indexZ].funParaDesc[indexA].showFormCreate[indexS].valueI.pop()
					}
				}
			},
			changeFnc(step,indexS){
				this.functionName=this.fncList[indexS].fncItem[this.fncShowId[indexS]].functionName;
				this.workID=step.workId;
				this.itemID=step.id;
				this.stepIndex=indexS;
				this.stepShowName=step.stepName;
				getModelFncParaShow(window.sessionStorage.ApiUrl,{
					'token':window.localStorage.adminToken,
					'work_id':step.workId,
					'step_id':step.id,
					'fun_id':this.fncList[indexS].fncItem[this.fncShowId[indexS]].id
				}).then(res=>{
					if(res.data.status==200){
						var lll=res.data.data
						lll.map(item=>item.funParaDesc=JSON.parse(item.funParaDesc))
						this.paraShowList=lll
						this.functionId=this.fncList[indexS].fncItem[this.fncShowId[indexS]].id
						this.functionChangeId=this.fncList[indexS].fncItem[this.fncShowId[indexS]].id
						this.functionUrl=this.fncList[indexS].fncItem[this.fncShowId[indexS]].functionPath
						this.functionChangeUrl=this.fncList[indexS].fncItem[this.fncShowId[indexS]].functionPath
					}else if(res.data.status == 201){
						this.$message({
							type: 'info',
							message: 'token失效，为保障账户安全，请重新登陆'
						});						 
						window.localStorage.clear()
						window.window.sessionStorage.setItem('isLogin','0')
						this.$router.push('/login'); 
					} else if(res.data.status==300){
						this.$message.error({
							message: '加载失败',
							showClose: false
						});
						this.loading=false;
					}else if(res.data.status==400){
						this.$message.error({
							message: '加载失败',
							showClose: false
						});
						this.loading=false;
					}else if(res.data.status==401){
						this.$message.error({
							message: '该步骤下未绑定模块或函数',
							showClose: false
						});
						
						this.loading=false;
					}else if(res.data.status==500){
						this.$message.error({
							message: '加载失败',
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
				}).catch(err=>{
					
				})
			},
			stepClick(step,indexS){
				var step=step
				var indexS= indexS	
				this.stepShowName=step.stepName
				this.stepIndex= indexS
				this.isSuccess[indexS]=true
				this.isVisited[indexS]=true
				this.fncList.length=10
				this.workID=step.workId
				this.itemID=step.id
				this.uploading=true
				this.dataRelationList={
					inputData:[],
					resultData:[]
				}
				if(step.stepName=="设计输出"){
					this.paraShowList=[]
					getFncComParaList(window.sessionStorage.ApiUrl,{
						'token':window.localStorage.adminToken,
						'fun_id':this.functionId
					}).then(res=>{
						if(res.data.status==200){
							if(res.data.data.paraJson){
								this.dataRelationList=JSON.parse(res.data.data.paraJson)
							}else{
								this.dataRelationList={
									inputData:[],
									resultData:[]
								}
							}
						}else if(res.data.status == 201){
							this.$message({
								type: 'info',
								message: 'token失效，为保障账户安全，请重新登陆'
							});						 
							window.localStorage.clear()
							window.window.sessionStorage.setItem('isLogin','0')
							this.$router.push('/login'); 
						}else{}
					}).catch()
					this.uploading=false
				}else if(step.stepName=="设计输入"){
					getModelFncParaList(window.sessionStorage.ApiUrl,{
						'token':window.localStorage.adminToken,
						'work_id':step.workId,
						'step_id':step.id
					}).then(res=>{
						let showSelect=true
						if(res.data.status==200){
							var funItem=res.data.data
							if(res.data.data.length>1){
								showSelect=true
							}else{
								showSelect=false
							}
							this.functionId=funItem[0].id
							this.functionUrl=funItem[0].functionPath
							this.functionName=funItem[0].functionName
							this.fncList.splice(indexS, 1,{
								fncItem:funItem,
								selectIsShow:showSelect
							})
							getModelFncParaShow(window.sessionStorage.ApiUrl,{
								'token':window.localStorage.adminToken,
								'work_id':step.workId,
								'step_id':step.id,
								'fun_id':this.fncList[indexS].fncItem[this.fncShowId[indexS]].id
							}).then(res=>{
								this.uploading=false
								if(res.data.status==200){
									var lll=res.data.data
									lll.map(item=>item.funParaDesc=JSON.parse(item.funParaDesc))
									this.paraShowList=lll
								}else if(res.data.status == 201){
									this.$message({
										type: 'info',
										message: 'token失效，为保障账户安全，请重新登陆'
									});						 
									window.localStorage.clear()
									window.window.sessionStorage.setItem('isLogin','0')
									this.$router.push('/login'); 
								} else if(res.data.status==300){
									this.$message.error({
										message: '加载失败',
										showClose: false
									});
									this.loading=false;
								}else if(res.data.status==400){
									this.paraShowList=[]
									this.loading=false;
								}else if(res.data.status==401){
									this.$message.error({
										message: '该步骤下未绑定模块或函数',
										showClose: false
									});
									
									this.loading=false;
								}else if(res.data.status==500){
									this.$message.error({
										message: '加载失败',
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
							}).catch()
						}else if(res.data.status == 201){
							this.$message({
								type: 'info',
								message: 'token失效，为保障账户安全，请重新登陆'
							});						 
							window.localStorage.clear()
							window.window.sessionStorage.setItem('isLogin','0')
							this.$router.push('/login'); 
						} else if(res.data.status==300){
							this.$message.error({
								message: '加载失败',
								showClose: false
							});
							this.loading=false;
						}else if(res.data.status==400){
							this.paraShowList=[]
							this.uploading=false
							this.loading=false;
						}else if(res.data.status==401){
							this.$message.error({
								message: '该步骤下未绑定模块或函数',
								showClose: false
							});
							this.fncList.splice(indexS, 1,{
								fncItem:[],
								selectIsShow:showSelect
							})
							this.loading=false;
						}else if(res.data.status==500){
							this.$message.error({
								message: '加载失败',
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
					}).catch()
				}else{
					getModelFncParaList(window.sessionStorage.ApiUrl,{
						'token':window.localStorage.adminToken,
						'work_id':step.workId,
						'step_id':step.id
					}).then(res=>{
						let showSelect=true
						if(res.data.status==200){
							var funItem=res.data.data
							if(res.data.data.length>1){
								showSelect=true
							}else{
								showSelect=false
							}
							this.functionName=funItem[0].functionName;
							if(this.functionChangeId){
								this.functionId=this.functionChangeId
								this.functionUrl=this.functionChangeUrl
							}else{
								this.functionId=funItem[0].id
								this.functionUrl=funItem[0].functionPath
							}
							this.fncList.splice(indexS, 1,{
								fncItem:funItem,
								selectIsShow:showSelect
							})
							getModelFncParaShow(window.sessionStorage.ApiUrl,{
								'token':window.localStorage.adminToken,
								'work_id':step.workId,
								'step_id':step.id,
								'fun_id':this.fncList[indexS].fncItem[this.fncShowId[indexS]].id
							}).then(res=>{
								this.uploading=false
								if(res.data.status==200){
									var lll=res.data.data
									lll.map(item=>item.funParaDesc=JSON.parse(item.funParaDesc))
									this.paraShowList=lll
								}else if(res.data.status == 201){
									this.$message({
										type: 'info',
										message: 'token失效，为保障账户安全，请重新登陆'
									});						 
									window.localStorage.clear()
									window.window.sessionStorage.setItem('isLogin','0')
									this.$router.push('/login'); 
								} else if(res.data.status==300){
									this.$message.error({
										message: '加载失败',
										showClose: false
									});
									this.loading=false;
								}else if(res.data.status==400){
									this.paraShowList=[]
									this.loading=false;
								}else if(res.data.status==401){
									this.$message.error({
										message: '该步骤下未绑定模块或函数',
										showClose: false
									});
									
									this.loading=false;
								}else if(res.data.status==500){
									this.$message.error({
										message: '加载失败',
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
							}).catch()
						}else if(res.data.status == 201){
							this.$message({
								type: 'info',
								message: 'token失效，为保障账户安全，请重新登陆'
							});						 
							window.localStorage.clear()
							window.window.sessionStorage.setItem('isLogin','0')
							this.$router.push('/login'); 
						} else if(res.data.status==300){
							this.$message.error({
								message: '加载失败',
								showClose: false
							});
							this.loading=false;
						}else if(res.data.status==400){
							this.paraShowList=[]
							this.uploading=false
							this.loading=false;
						}else if(res.data.status==401){
							this.$message.error({
								message: '该步骤下未绑定模块或函数',
								showClose: false
							});
							this.fncList.splice(indexS, 1,{
								fncItem:[],
								selectIsShow:showSelect
							})
							this.loading=false;
						}else if(res.data.status==500){
							this.$message.error({
								message: '加载失败',
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
					}).catch()
				}
				
			},
			loadOperation(item,index){
				this.dataIsShow=false
				var indexOpe=index
				window.sessionStorage.setItem('stepIndex',indexOpe);
				window.localStorage.setItem('workName',item.workName);
				this.stepShowName="参数信息";
				this.operationName=item.workName;
				this.stepList=[];
				this.fncList=[];
				this.downLoadBtn=false;
				this.resultShow=``;
				this.paraShowList=[];
				this.fncList.length=10;
				this.paraIsShow=[false,false,false,false,false];
				this.fncShowId=[0,0,0,0,0];
				this.isVisited=[false,false,false,false,false];
				this.isSuccess=[false,false,false,false,false];
				this.itemID=item.id;
				this.functionChangeId='';
				this.functionChangeUrl='';
				window.localStorage.setItem('workId',this.itemID);
				getWorkStepList(window.sessionStorage.ApiUrl,{
					'token':window.localStorage.adminToken,
					'work_id':this.itemID
				}).then(res=>{
					if(res.data.status==200){
						this.stepList=res.data.data.reverse()
						this.stepList.push({
							id: 9999, workId: 9999, stepName: "设计输出"
						})
					}else if(res.data.status == 201){
						this.$message({
							type: 'info',
							message: 'token失效，为保障账户安全，请重新登陆'
						});						 
						window.localStorage.clear()
						window.window.sessionStorage.setItem('isLogin','0')
						this.$router.push('/login'); 
					} else if(res.data.status==300){
						this.$message.error({
							message: '加载失败',
							showClose: false
						});
						this.loading=false;
					}else if(res.data.status==400){
						this.$message.error({
							message: '加载失败',
							showClose: false
						});
						this.loading=false;
					}else if(res.data.status==401){
						this.$message.error({
							message: '该步骤下未绑定模块或函数',
							showClose: false
						});
						this.fncList.splice(indexS, 1,{
							fncItem:[],
							selectIsShow:showSelect
						})
						this.loading=false;
					}else if(res.data.status==500){
						this.$message.error({
							message: '加载失败',
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
				}).catch(err=>{
					this.$message.error({
						message: '请检查网络',
						showClose: false
					});
				})
			},
			//===========================================游戏===============================================
			nextGame(){

			},
			prevGame(){

			},
			showGameToPlay(){
				this.gameShow=true;
				this.gameList=[
					{white:false},{white:false},{white:false},{white:false},{white:false},
					{white:false},{white:true},{white:false},{white:true},{white:false},
					{white:false},{white:false},{white:true},{white:false},{white:false},
					{white:false},{white:true},{white:false},{white:true},{white:false},
					{white:false},{white:false},{white:false},{white:false},{white:false}
				];
				var randomNum=Math.round(Math.random())
				var randomList=[Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),
				Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),
				Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),
				Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),
				Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random())];
				this.gameList=randomList.map(item=>{
					if(item==0){
						return {white:false}
					}else if(item==1){
						return {white:true}
					}
				})
			},
			closeGame(){
				this.gameShow=false
			},
			changeColor(index){
				this.gameList[index].white=!this.gameList[index].white
				var a=index;
				var b=index-1;
				var c=index+1;
				var d=index-5;
				var e=index+5;
				if(b>=0&&b%5!=4&&b<25){
					this.gameList[b].white=!this.gameList[b].white
				}
				if(c%5!=0&&c<25){
					this.gameList[c].white=!this.gameList[c].white
				}
				if(d>=0&&d<25){
					this.gameList[d].white=!this.gameList[d].white
				}
				if(e>=0&&e<25){
					this.gameList[e].white=!this.gameList[e].white
				}
				this.reGameList=this.gameList.map(t=>t.white).filter(t=>t==false)
				if(this.reGameList.length==0){
					this.$message({
						type: 'success',
						message: '恭喜您胜利'
					});	
				}
			}
		},
		created(){
			if(window.sessionStorage.getItem('stepIndex')){
				this.stepShowIndex=`1-`+window.sessionStorage.getItem('stepIndex')
			}
			this.downLoadImgBaseUrl=window.sessionStorage.DownLoadUrlH+ossDownBaseURL_g
			this.uploadUrl=window.sessionStorage.ApiUrl+ossBaseURL_g+window.localStorage.adminToken
			if(window.localStorage.computeResult){
				this.resultFirst=JSON.parse(window.localStorage.computeResult)
			}else{
				this.resultFirst=''
			}
			getWorkList(window.sessionStorage.ApiUrl,{
				'token':window.localStorage.adminToken
			}).then(res=>{
				if(res.data.status==200){
					this.operationList=res.data.data
					this.loading=false;
					if(window.localStorage.workName){
						this.operationName=window.localStorage.workName
					}else{
						this.operationName=this.operationList[0].workName
					}
					var workIDF=window.localStorage.workId?window.localStorage.workId:this.operationList[0].id
					getWorkStepList(window.sessionStorage.ApiUrl,{
						'token':window.localStorage.adminToken,
						'work_id':workIDF
					}).then(res=>{
						if(res.data.status==200){
							this.stepList=res.data.data.reverse()
							this.stepList.push({
								id: 9999, workId: 9999, stepName: "设计输出"
							})
							this.itemID=this.stepList[0].id
						}else if(res.data.status == 201){
							this.$message({
								type: 'info',
								message: 'token失效，为保障账户安全，请重新登陆'
							});						 
							window.localStorage.clear()
							window.window.sessionStorage.setItem('isLogin','0')
							this.$router.push('/login'); 
						} else if(res.data.status==300){
							this.$message.error({
								message: '加载失败',
								showClose: false
							});
							this.loading=false;
						}else if(res.data.status==400){
							this.$message.error({
								message: '加载失败',
								showClose: false
							});
							this.loading=false;
						}else if(res.data.status==500){
							this.$message.error({
								message: '加载失败',
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
					}).catch(err=>{
						
					})
				}else if(res.data.status == 201){
					this.$message({
						type: 'info',
						message: 'token失效，为保障账户安全，请重新登陆'
					});						 
					window.localStorage.clear()
					window.window.sessionStorage.setItem('isLogin','0')
					this.$router.push('/login'); 
				} else if(res.data.status==300){
					this.$message.error({
						message: '加载失败',
						showClose: false
					});
					this.loading=false;
				}else if(res.data.status==400){
					this.$message.error({
						message: '加载失败',
						showClose: false
					});
					this.loading=false;
				}else if(res.data.status==500){
					this.$message.error({
						message: '加载失败',
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
			}).catch(err=>{
				this.$message.error({
					message: '请检查网络',
					showClose: false
				});
			})
			
		},
		mounted(){
			
		},
		data() {
			return {
				rules: {
					valueStr:[
						{ required: true, message: '请输入内容', trigger: 'blur' },
					],
					valueNum:[
						{ required: true, message: '请输入数值', trigger: 'blur' },
						{ type: 'number', message: '数据必须为数字值', trigger: 'blur' }
					]
			  	},
				functionChangeUrl:'',
				functionChangeId:'',
				tableShowData:{
					xTable:[],
					yTable:[],
					xName:'',
					yName:''
				},
				tableIsShow:false,
				dataIsShow:false,
				showCompareImg:true,
				onClickList:{
					inputData:'',
					resultData:'',
					logLength:5
				},
				dataRelationList:{
					inputData:[],
					resultData:[]
				},
				reGameList:[],
				loadingA:false,
				gameShow:false,
				gameList:[
					{white:false},{white:false},{white:false},{white:false},{white:false},
					{white:false},{white:true},{white:false},{white:true},{white:false},
					{white:false},{white:false},{white:true},{white:false},{white:false},
					{white:false},{white:true},{white:false},{white:true},{white:false},
					{white:false},{white:false},{white:false},{white:false},{white:false}
				],
				showResultCont:false,
				stepShowIndex:`1-0`,
				downLoadReportURL:'',
				uploading:false,
				uploadingA:false,
				stepShowName:'参数信息',
				filePath:false,
				itemIndexA:'',
				itemIndexZ:'',
				itemIndexS:'',
				itemIndexL:'',
				uploadUrl:'',
				downLoadBtn:false,
				stepIndex:0,
				itemID:'',
				functionId:'',
				functionName:'',
				functionUrl:'',
				paraValueList:{
					'paras':[],
					'file':true
				},
				fnc:'',
				downLoadImgBaseUrl:'',
				paraDomain:{
					paraShowList:[]
				},
				paraShowList:[],
				paraIsShow:[false,false,false,false,false],
				fncShowId:[0,0,0,0,0],
				workID:'',
				resultFirst:[],
				resultShow:``,
				isVisited:[false,false,false,false,false],
				stepClass:"c-name",
				isSuccess:[false,false,false,false,false],
				isSuccess0:false,
				isSuccess1:false,
				isSuccess2:false,
				isSuccess3:false,
				isSuccess4:false,
				loading:true,
				operationName:'业务流程',
				isCollapse:true,
				operationList:[],
				fncList:[],
				stepList:[]
			}
		}
	}
</script>
<style lang="scss" scoped>
	$cNumSize:16px;
	$primary:#409EFF;
	$success:#67C23A;
	.content-views {
		display:flex;		
		height: 100%;
		position: relative;
		.operation-list{
			flex:0 0 200px;
			height:100%;
			background: #222d32;
			overflow-y:auto;
			overflow-x:hidden;
		}
		.operation-step{
			flex:1;
			height:100%;
			overflow-y:auto;
			padding:0 15px;
			display: flex;
			flex-direction: column;
			position: relative;
			.table-show{
				width:100%;
				height:100%;
				position: absolute;
				top:0;
				left:0;
				background: rgba(0,0,0,.8);
				text-align: center;
				z-index: 888;
				.charts{
					margin:100px auto 0;
					width:1000px;
					
				}
			}
			.data-show{
				width:100%;
				height:100%;
				position: absolute;
				top:0;
				left:0;
				background: rgba(0,0,0,.8);
				text-align: center;
				z-index:888;
			}
			h3{
				height:50px;
				line-height:50px;
				flex:0 0 50px;
				border-bottom: 1px solid #ccc;
				text-indent: 10px;
			}
			.operation-step-result{
				flex:0 0 220px;
				overflow: hidden;
				border-top:1px solid #CCC;
				padding:0 10px;
				h4{
					height:70px;
					line-height: 70px;
				}
				.operation-step-result-cont{
					height:160px;
					display: flex;
					position: relative;
					.result-textarea{
						flex:1;
						margin:0 60px;
						padding:5px 10px;
						height:100px;
						width:100%;
						word-wrap: break-word;
						overflow-y: auto;
						overflow-x: hidden;
						border:1px solid #ccc;
						border-radius: 4px;
						cursor: pointer;
					}
					.result-btn1{
						position: absolute;
						background: #409EFF;
						border-radius: 4px;
						cursor: pointer;
						color: #fff;
						text-align: center;
						top:-50px;
						right:0;
					}
					.result-btn1:hover{
						background:rgba(64,158,255,.9);
					}
				}
			}
			.operation-step-cont{
				flex:1;
				overflow: hidden;
				display: flex;
				.operation-step-steps{
					flex:1;
					min-width: 475px;
					height:100%;
					padding:0 10px;
					overflow-y: auto;
					overflow-x:hidden;
					h4{
						height:60px;
						line-height: 40px;
					}
					.operation-step-s-c{
						margin:5px 0;
						padding:0px 20px;
						.s-c-head{
							overflow: hidden;
							.c-num{
								float: left;
								font-size: 14px;
								width: $cNumSize;
								height:$cNumSize;
								line-height:$cNumSize;
								border-radius: 50%;
								border:1px solid $primary;
								text-align: center;
								margin:5px;
								color:$primary;
							}
							.c-success{
								float: left;
								font-size: 14px;
								width: $cNumSize;
								height:$cNumSize;
								line-height:$cNumSize;
								border-radius: 50%;
								border:1px solid $success;
								text-align: center;
								margin:5px;
								background: $success;
								color:#fff;
							}
							.c-name{
								text-align: center;
								width:150px;
								float: left;
								position: relative;
								height:26px;
								line-height:26px;
								border:1px solid $primary;
								border-radius: 4px;
								cursor: pointer;
								margin:0 10px;
								color:#fff;
								background: $primary;
							}
							.c-name:hover{
								border:1px solid $primary;
								color:$primary;
								background: #fff;
							}
							.c-name1{
								text-align: center;
								width:150px;
								float: left;
								position: relative;
								height:26px;
								line-height:26px;
								border:1px solid $primary;
								border-radius: 4px;
								cursor: pointer;
								margin:0 10px;
								color:$primary;
								z-index: 2;
							}
							.c-sec{
								margin-left:26px;
								max-width: 150px;
							}
							.c-select{
								position: relative;
							}
							.c-select::before{
								content:'';
								display:inline-block;
								width: 16px;
								height:26px;
								border-top:2px dashed #dcdfe6;
								position: absolute;
								top:12px;
								left:200px;
							}
						}
						.s-c-body{
							border-left:2px dashed #ccc;
							background-size: 80px 40px; 
							padding: 0 0 0 184px;
							overflow: hidden;
							margin-left: 13px;
							.s-c-paras{
								margin:30px 0 20px;
								width:200px;
								border:1px solid rgba(42, 42, 216, 0.1);
								border-radius:4px;
								text-align: center;
								position: relative;
								.s-c-p-item{
									margin-top:12px;
									background: rgba(42, 42, 216, 0.1);
									height:28px;
									line-height: 28px;
									width: 100%;
								}
								div:last-child{
									margin-bottom:12px;
									border-bottom:0px solid #909090;
								}
							}
							
							.s-c-paras::after{
								content:'';
								display: block;
								height:14px;
								border-left:2px dashed #dcdfe6;
								border-radius:0 0 0 0;
								width:4px;
								position: absolute;
								top:-24px;
								right:98px;
							}
						}
						.s-c-body1{
							border-left:2px dashed #ccc;
							background-size: 80px 40px; 
							padding: 0 0 0 160px;
							overflow: hidden;
							height:68px;
							margin-left: 13px;
						}
					}
					div:last-child{
						.s-c-body{
							border-left:2px dashed rgba(0,0,0,0);
						}	
						.s-c-body1{
							border-left:2px dashed rgba(0,0,0,0);
						}
					}
				}
				.operation-step-paras{
					flex:1;
					height:100%;
					max-width:800px;
					min-width: 530px;
					overflow-y:auto;
					overflow-x:hidden;
					background: #fff;
					border-left: 1px solid #ccc;
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
		.result-show{
			height:100%;
			width:100%;
			position: absolute;
			top:0;
			left:0;
			background: rgba(0,0,0,.8);
			text-align: left;
			z-index: 100;
			.result-detial{
				box-sizing: border-box;
				background:#fff;
				border: 1px solid #ccc;
				border-radius:4px;
				position: absolute;
				left:50%;
				top:50%;
				margin:-300px 0 0 -500px; 
				width:1000px;
				height:600px;
				padding:10px 80px;
				display:flex;
				flex-direction: column;
				h4{
					flex:0 0 40px;
					margin-left:-40px;
					line-height:40px;
				}
				.result-cont{
					flex:1;
					height:636px;
					overflow: hidden;
					border: 1px solid #ccc;
					border-radius:4px;
					word-wrap: break-word;
					overflow-y:auto;
					overflow-x: hidden;
				}
				.download{
					flex:0 0 60px;
					padding:20px 0 0;
					text-align:center;
				}
			}
		}
		
		.computing{
			height:100%;
			width:100%;
			position: absolute;
			top:0;
			left:0;
			background: rgba(0,0,0,.8);
			text-align: center;
			z-index:888;
			.computing-title{
				color:#409EFF;
				text-align: center;
				height:300px;
				width: 500px;
				position: absolute;
				top:50%;
				left:50%;
				margin: -200px 0 0 -250px;
			}
			.computing-title1{
				color:#409EFF;
				text-align: center;
				position: absolute;
				height:200px;
				width: 300px;
				left:85%;
				top:50%;
				margin:-100px 0 0 -150px;
			}
			.little-game{
				width:500px;
				height:500px;
				position: absolute;
				top:50%;
				left:50%;
				margin: -282px 0 0 -282px;
				background: #666;
				padding:30px;
				border-radius:10px;
				border:2px solid #ccc;
				position: relative;
				.game-name{
					position: absolute;
					left:50%;
					top:-40px;
					height:40px;
					line-height: 40px;
					width:564px;
					margin-left:-282px;
					font-size:16px;
					font-weight: 600;
					background:  rgba(0,0,0,0);
					color:#409EFF;
				}
				.game-close{
					cursor: pointer;
					position: absolute;
					right:-80px;
					top:-40px;
					height:20px;
					line-height: 20px;
					width:60px;
					font-size:12px;
					color:#409EFF;
				}
				.game-close:hover{
					border:1px solid #fff;
					border-radius: 4px;
				}
				.game-box{
					width: 90px;
					height:90px;
					float: left;
					background: #000;
					box-sizing: border-box;
					border-radius: 50%;
					overflow: hidden;
					margin:5px;
					.game-boxB{
						width: 80px;
						height:90px;
						background: url(../../assets/game.jpg) no-repeat;
						background-size: 165px 110px;
						background-position: -2px -5px;
						border-radius: 50%;
					}
					.game-boxW{
						width: 90px;
						height:90px;
						border-radius: 50%;
						background: url(../../assets/game.jpg) no-repeat;
						background-size: 165px 110px;
						background-position: -70px -5px;
					}
				}
				.game-introduction{
					position: absolute;
					left:-210px;
					top:0;
					width:180px;
					text-align: left;
					padding:10px;
					color:#ccc;
					h4{
						text-align: center;
						height:60px;
						line-height: 60px;
					}
				}
				.game-btn{
					display: none;
					position: absolute;
					left:50%;
					bottom:-40px;
					height:28px;
					width:180px;
					margin-left:-90px;
				}
			}
		}
	}
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
</style>