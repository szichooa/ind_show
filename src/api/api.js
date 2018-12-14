import axios from 'axios';

//开发环境
// let fncBaseURL = 'http://192.168.1.181:8085';//函数
// let modelBaseURL = 'http://192.168.1.181:8086';//模块
// let userBaseURL = 'http://192.168.1.181:8084';//用户，历史
// let opeBaseURL = 'http://192.168.1.181:8083';//业务
// let ossBaseURL = 'http://192.168.1.181:8087';//上传地址
let allBaseURL='';
let localBaseURL='http://192.168.1.181';
let ossDownBaseURL = '';//下载地址

// let allBaseURL='http://192.168.1.193';
// let ossDownBaseURL = 'http://192.168.1.192';

let fncBaseURL =  allBaseURL+':8085';//函数
let modelBaseURL = allBaseURL+':8086';//模块
let userBaseURL = allBaseURL+':8084';//用户
let opeBaseURL = allBaseURL+':8083';//业务
let ossBaseURL = allBaseURL+':8087';//上传地址
let dataBaseURL = allBaseURL+':8081';//数据库


//================================================上传==========================================================================
export const ossBaseURL_g=ossBaseURL+'/oss/upload_fastdfs'+'?token='
export const ossDownBaseURL_g=ossDownBaseURL+"/"
//================================================登录==========================================================================
export const requestLogin = (baseUrlHere,params) => { return axios.post(baseUrlHere+`${userBaseURL}/user/client/login`, params); };
//================================================用户==========================================================================

//获取用户信息
export const getUserById = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${userBaseURL}/user/client/get_user_by_id`, { params: params }); };
//编辑用户
export const editUserById = (baseUrlHere,params) => { return axios.post(baseUrlHere+`${userBaseURL}/user/client/edit_user_by_id`, params); };

//获取工作流列表
export const getWorkList = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${opeBaseURL}/work/client/get_work_list`,  { params: params }); };
//获取工作流步骤列表
export const getWorkStepList = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${opeBaseURL}/work/client/step/get_work_step_by_wid`,  { params: params }); };

//获取模块对应的函数和参数
export const getModelFncParaList = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${modelBaseURL}/modular/client/get_modular`,  { params: params }); };
//获取模块对应的函数和参数
export const getModelFncParaShow = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${modelBaseURL}/modular/client/fun_para/get_modular_fun_para`,  { params: params }); };

//函数计算
export const funCallBackFun = (baseUrlHere,params) => { return axios.post(baseUrlHere+`${fncBaseURL}/fun/client/call_back_fun`, params); };
//获取历史
export const getHistory = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${fncBaseURL}/fun_uselog/client/get_fun_uselog`, { params: params }); };
//删除历史
export const delHistory = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${fncBaseURL}/fun_uselog/client/del_fun_uselog`, { params: params }); };
//计算历史
export const addHistoryPara = (baseUrlHere,params) => { return axios.post(baseUrlHere+`${fncBaseURL}/fun_history/client/add_history_para`, params); };
//获取计算历史
export const getHistoryPara = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${fncBaseURL}/fun_history/client/get_history_para`, { params: params }); };
//删除计算历史
export const delHistoryPara = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${fncBaseURL}/fun_history/client/del_history_para`, { params: params }); };

//唤醒软件api
export const callSoftware = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${fncBaseURL}/fun/client/call_exe`, { params: params }); };
//获取函数关系列表
export const getFncComParaList = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${fncBaseURL}/fun_com_para/client/get_list`, { params: params }); };
//获取生成图表数据
export const getFncComParaData = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${fncBaseURL}/fun/client/get_uselog_compare`, { params: params }); };


//查询数据库
export const getDataListDB = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${dataBaseURL}/database/client/get_result_db`, { params: params }); };
//获取数据关系
export const getDataBind = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${dataBaseURL}/database_attr/client/get_result_db_attr`, { params: params }); };
//获取数据库内容
export const getResultDBData = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${dataBaseURL}/database_data/client/get_result_db_data`, { params: params }); };
//删除数据库内容
export const delResultDBData = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${dataBaseURL}/database_data/client/del_result_db_data`, { params: params }); };
//分析数据库
export const getResultDBDataCom = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${dataBaseURL}/database_data/client/get_result_db_data_compare`, { params: params }); };




//获取本地数据库列表
export const getLocalDBList = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${dataBaseURL}/local_database/client/get_local_db`, { params: params }); };
//获取本地数据库表头
export const getLocalDBTh = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${dataBaseURL}/local_database_attr/client/get_local_db_attr`, { params: params }); };
//获取本地数据库详情
export const getLocalDBData = (baseUrlHere,params) => { return axios.get(baseUrlHere+`${dataBaseURL}/local_database_data/client/get_local_db_data`, { params: params }); };