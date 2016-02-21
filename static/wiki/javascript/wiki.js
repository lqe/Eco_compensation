 // JavaScript Document
//U1.js的分层（功能）：jquery（tools） 组件（ui） 应用层（app） mvc（backboneJs）
//js的规划（管理）：避免全局变量和方法（命名空间，闭包，面向对象），模块化（seaJs ,requireJs）
window.onload = function(){
	wiki.history.version()
	wiki.article.del()
	wiki.create.vaildate()
};
var wiki = {}; //命名空间
wiki.history = {};
wiki.article={};
wiki.create={};
//tools
//ui 
//app
wiki.create.vaildate=function(){
	$("#create").click(function(){
			if(this.innerText==' 创建词条' &&  $("#create-form .asteriskField:contains('OK')").length!=2){
				alert("位置和标题必须填写")
			}
			else{
				$("#create-form").submit()
			}
		})
	$("#create-form :input").blur(function(){
		if($(this).is("#postion")){
			var Msg
			var $me=$(this)
			if (this.value==""){
				Msg='必填*';
				$me.parent().parent().find(".asteriskField").html("<font color='#000'>"+Msg+"<font>")
			}else{
				var _postion=$("#_postion").val()
				$.get('/wiki/createCheck',{"postion":_postion+this.value},function(data,statusText){
					var msg=JSON.parse(data)['msg'];
					if (msg=='OK'){
						Msg='OK'
					}else{
						Msg="位置已存在"
					};
					$me.parent().parent().find(".asteriskField").html(Msg)
				});
			}
		};
		if($(this).is("#title")){
			var Msg
			var $me=$(this)
			if (this.value==""){
				Msg='必填*';
				$me.parent().find(".asteriskField").html(Msg)
			}
			else{
				$me.parent().find(".asteriskField").html("OK")
			}
		};
	})
}
/*  vaildate=function(){
	$("#create-form:input").blur(function(){
		$(this).parent().find(".asteriskField").html("必须填写*")
		if($(this).is("#postion")){
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
	});
};*/
wiki.article.del=function(){
	items=$(".catalog_del")
	urls=$(".catalog_del_url")
	items.each(function(index,i){
			me=$(this)
			me.click(function(){
				url=urls[index].innerHTML
				console.log(url)
				deferred=$.ajax({url:url})
				deferred.done(function(data,statusText){
					console.log(data)
					console.log(statusText)
						if(data){
							window.location.href=window.location.href
						}
						
					})
			})
				
	})
}
wiki.history.version=function(){
	items=$(".using")
	items.each(function(index,i){
			me=$(this)
			me.click(function(){
				_id=$("._id")[index].value
				console.log(_id)
				deferred=$.ajax({url:'/wiki/history',data:{'_id':_id}})
				deferred.done(function(data,statusText){
						if(data){
							window.location.href=window.location.href
						}
						
					})
			})
				
	})
				

			/*	me.click(function(){
					_id=$("._id")[Qindex].innerHTML
					deferred=$.ajax({url:'/Del/blog_content',data:{'_id':_id}})
					deferred.done(function(data,statusText){
						if(data){
							alert("删除成功")
							window.location.href=window.location.href
						}
						
					})
					deferred.fail(function(){
						alert("服务器响应出错！")
					})
				})
			}
		})
	})*/


}
/*wiki.app.level=function(){
	b=$('.wiki_b');
	c=$('.wiki_c');
	titleul=$('.wiki_title').find('ul');
	bul=b.find('ul');
	cul=c.find('ul');
	
	b.click(function(event){
		cul.hide();
		bul.slideToggle();
		event.stopPropagation()
	});
	c.click(function(event){
		bul.hide();
		cul.slideToggle();
		event.stopPropagation()
	});
	$(document).click(function(){
		titleul.hide();
	});
	titleul.find('li').each(function(){
		$(this).mouseover(function(){$(this).css('background','#000');$(this).find('a').css('color','#fff') });
		$(this).mouseout(function(){$(this).css('background','#fff');$(this).find('a').css('color','#000')});
	});
}*/



  