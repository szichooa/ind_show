<template>
  <div class="apps">
    <router-view/>
  </div>
</template>

<script>
export default {
	name: 'App',
	mounted:function(){
		  this.getConfigJson();
	}
}
</script>

<style>
	.el-tooltip__popper{
		max-width:280px !important;
		background: #fff;
		color:#606266;
		border:1px solid #ccc;
		line-height:18px;
	}
	.el-table th{
		background:rgb(221, 221, 221) !important;
	}
	.el-table th:nth-child(1){
		color:#000 !important;
		font-size:14px !important;
		font-weight:600 !important;
	}
	.el-table th:nth-child(2){
		color:#000 !important;
		font-size:14px !important;
		font-weight:600 !important;
	}
	.el-table th:nth-child(3){
		color:#000 !important;
		font-size:14px !important;
		font-weight:600 !important;
	}
	.el-checkbox+.el-checkbox{
		margin-left:0 !important;
	}
	.apps {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.el-menu-item.is-active{
		background-color:rgb(27,36,40) !important;
	}
	.el-input__prefix{
		left:120px !important;
	}
	.cell{
		text-align:center !important;
	}
	.el-submenu__title{
		width:200px !important;
	}
	.el-form-item__label{
		font-size: 12px !important;
		white-space: nowrap !important; 
	}
	.el-input__inner,.el-textarea__inner{
		padding:0 5px !important;
	}
	.el-checkbox__label {
    	display: inline !important;
	}
	el-input{
		font-size: 12px;
	}
	html,
	body {
		position: relative;
	}
	/* CSS Document */
	
	body,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	p,
	a,
	img,
	input,
	ul,
	li,
	ol,
	dl,
	dt,
	dd,
	figure,
	figcaption {
		padding: 0;
		margin: 0
	}
	
	img {
		display: block;
		border: 0;
		cursor: pointer;
	}
	
	input {
		outline: none;
		border: 0;
	}
	
	ul,
	ol {
		list-style: none;
	}
	.el-menu{
		border-right: 0;
		width:200px;
	}
	body {
		font-size: 14px;
		font-family:  -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei;
		color: #3e3e3e;
		min-height: 720px;
		min-width: 1280px;
	}
	textarea{
		font-family:  -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei;
	}
	a {
		text-decoration: none;
		color:  #3e3e3e;
		display: block;
		cursor:auto;
	}
	.el-checkbox+.el-checkbox {
		margin-left: 0px;
	}
	a:hover {
		color:  #3e3e3e;
	}
	.el-form-item__content{
		font-size: 12px;
	}
	header,
	footer,
	section,
	figure,
	figcaption,
	main,
	nav,
	aside,
	article {
		display: block;
	}
	
	.l {
		float: left;
	}
	
	.r {
		float: right;
	}
	
	.w {
		width: 1200px;
		margin: 0 auto;
	}
</style>