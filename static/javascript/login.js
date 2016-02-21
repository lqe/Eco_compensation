 // JavaScript Document
//U1.js的分层（功能）：jquery（tools） 组件（ui） 应用层（app） mvc（backboneJs）
//js的规划（管理）：避免全局变量和方法（命名空间，闭包，面向对象），模块化（seaJs ,requireJs）
window.onload = function(){
		login.app.register();
		login.app.BackLogin();
		login.app.vaildate();
		
};
var login = {}; //命名空间
login.tools = {};
login.ui = {};
login.app  = {};

//tools
//ui 
//app
login.app.vaildate=function(){
	//login
	$("#login :input").blur(function(){
		$(this).parent().parent().find(".formtips").html(Msg)
		if($(this).is("#name_id")){
			var Msg
			var $me=$(this)
			if (this.value==""){
				Msg='*';
				$me.parent().parent().find(".formtips").html(Msg)
			}else{
				$.get('/loginCheck',{"name_id":this.value},function(data,statusText){
					Msg=JSON.parse(data)['msg'];
					if (Msg=='OK'){
						$me.parent().parent().find(".formtips").html('用户名不存在')
					}else{
						$me.parent().parent().find(".formtips").html('OK')
					}
				});
			}
		};
	}).keyup(function(){
		$(this).triggerHandler("blur");
	}).focus(function(){
		$(this).triggerHandler("blur");
	});//login
	
	//register
	$("#register :input").blur(function(){
		if($('#register .formtips:contains("OK")').length==6 ){
			$('.registerBtn').unbind('click')
			$('.registerBtn').click(function(){$('#register').submit()})
		}
		else{
			$('.registerBtn').unbind('click')
			$('.registerBtn').click(function(){alert('信息不完整')})
			
		}
		$(this).parent().parent().find(".formtips").html(Msg)
		if($(this).is("#name_id")){
			var Msg
			var $me=$(this)
			if (this.value==""){
				Msg='*';
				$me.parent().parent().find(".formtips").html(Msg)
			}else{
				$.get('/loginCheck',{"name_id":this.value},function(data,statusText){
					Msg=JSON.parse(data)['msg'];
					console.log(Msg);
					$me.parent().parent().find(".formtips").html(Msg)
				});
			}
		}else if($(this).is("#password1")){
			var Msg
			var $me=$(this)
			if (this.value.length<6){
				Msg='*';
				$me.parent().parent().find(".formtips").html("长度不小于6位")
			}else{
				$me.parent().parent().find(".formtips").html("OK")
			}
		}else if($(this).is("#password2")){
			var Msg
			var $me=$(this)
			if (this.value!=$("#password1").val()){
				$me.parent().parent().find(".formtips").html("密码不一致")
			}else{
				$me.parent().parent().find(".formtips").html("OK") 
			}
		}else if($(this).is("#name") || $(this).is("#department") ){
			var Msg
			var $me=$(this)
			if (this.value==""){
				Msg='*';
				$me.parent().parent().find(".formtips").html(Msg)
			}else{
				$me.parent().parent().find(".formtips").html("OK")
			};
		}else if($(this).is("#email")){
			var Msg
			var $me=$(this)
			if (this.value==""){
				Msg='*';
				$me.parent().parent().find(".formtips").html(Msg)
			}else{
				if (!/.+@.+\.[a-zA-Z]{2,4}$/.test(this.value)){
					$me.parent().parent().find(".formtips").html('不合法')
				}else{
					$me.parent().parent().find(".formtips").html('OK')
				}
			}
		};
	}).keyup(function(){
		$(this).triggerHandler("blur");
	}).focus(function(){
		$(this).triggerHandler("blur");
	});
	
};

login.app.BackLogin=function(){
	$(BackLogin).click(function(){
		$("#register").hide()
		$("#login").show()
	})
}
login.app.register=function(){
	$("#registerBtn").click(function(){
		$("#login").hide()
		$("#register").show()
		$('.registerBtn').click(function(){alert('请填写信息')})
		})
	}