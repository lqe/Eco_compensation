 // JavaScript Document
//U1.js的分层（功能）：jquery（tools） 组件（ui） 应用层（app） mvc（backboneJs）
//js的规划（管理）：避免全局变量和方法（命名空间，闭包，面向对象），模块化（seaJs ,requireJs）
window.onload = function(){
	meeting.app.sbt()
};
var meeting = {}; //命名空间
meeting.app  = {};

//ajax发送
meeting.app.sbt=function(){
	$('#Submit_1').click(function(){
		//$('#form_submit').submit()
		deferred=$.ajax({'url':'/meeting/add/participants','type':'POST','data':$('#form_submit').serialize()})
		deferred.done(function(data,statusText){
			if(data){
				alert("提交成功")
				window.location.href=window.location.href
			}
			
		})
		deferred.fail(function(){
			alert("服务器响应出错！")
		})
	}
)
	
}