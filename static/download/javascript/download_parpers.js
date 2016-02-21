 // JavaScript Document
//U1.js的分层（功能）：jquery（tools） 组件（ui） 应用层（app） mvc（backboneJs）
//js的规划（管理）：避免全局变量和方法（命名空间，闭包，面向对象），模块化（seaJs ,requireJs）
window.onload = function(){
		download_parpers.app.download()
};
var download_parpers = {}; //命名空间
download_parpers.tools = {};
download_parpers.ui = {};
download_parpers.app  = {};

download_parpers.app.download=function(){
	btns=$('.clickDownload')
	btns.each(function(index,ele){
		$(this).click(function(){
			href=$(this).next('.href')[0].innerHTML
			parhref=window.location.href
			window.location.href='/download?href='+href
		})
	})
}