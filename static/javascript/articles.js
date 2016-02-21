 // JavaScript Document
//U1.js的分层（功能）：jquery（tools） 组件（ui） 应用层（app） mvc（backboneJs）
//js的规划（管理）：避免全局变量和方法（命名空间，闭包，面向对象），模块化（seaJs ,requireJs）
window.onload = function(){
			common.app.pagenoSkip()
		};
var article = {}; //命名空间
article.tools = {};
article.ui = {};
article.app  = {};

