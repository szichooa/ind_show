'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
var ajaxURL = 'http://192.168.1.113:'
module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
    	'/user':{
    		target:ajaxURL+'8084',
				//用户
				}, 
				'/oss':{
          target:ajaxURL+'8087',
        //target:'http://192.168.1.118:8087',
        //文件管理
        },
        '/fun':{
          target:ajaxURL+'8085',
          //target:'http://192.168.1.118:8085',
          //函数
        },
        '/modular':{
          //模块
          target:ajaxURL+'8086',
          //target:'http://192.168.1.118:8086',
        },
        '/work':{
          //业务流
          target:ajaxURL+'8083',
          //target:'http://192.168.1.118:8083',
        }
//  		'/api': {
//            target: 'https://www.easyapi.com',
//            host: 'www.easyapi.com',
//            changeOrigin:true,
//            ///127958?documentId=16085&themeId=&categoryId=30087
////               pathRewrite: {
////                   '^/api/view': '/api/view'
////                 }
//        },
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 5432, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
