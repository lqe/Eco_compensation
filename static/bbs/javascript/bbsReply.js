 // JavaScript Document
//U1.js的分层（功能）：jquery（tools） 组件（ui） 应用层（app） mvc（backboneJs）
//js的规划（管理）：避免全局变量和方法（命名空间，闭包，面向对象），模块化（seaJs ,requireJs）
window.onload = function(){
	reply.voteClick()
	reply.btnSubmit()
};

var reply={}
reply.btnSubmit=function(){
	$("input[type=button]").bind("click",function(event){
		var submitting=true
		$.ajax({
				   	url:"/bbs/reply/addReply",
					method:'POST',
				   	data:$("#form").serializeArray()
				   })
					.done(function(data,statusText)
					{
						window.location.href=window.location.href
					})
					.fail(function(data,statusText){
						alert('失败'+statusText)
					})
		
	})
};
reply.voteClick=function(){
	$(".vote li").each(function(i)
	{
		$(this).bind("click",function(event)
		{
			var target=event.delegateTarget
			var str=target.innerHTML
			var reg=/\d+/
			var value=parseInt(str.match(reg)[0])
			
			if(target.innerHTML.indexOf('赞')>=0)
			{
				url='\\bbs\\reply\\addGooodComment'
			}
			else if (target.innerHTML.indexOf('踢')>=0)
			{
				url='\\bbs\\reply\\addNegativeComment'
			}
			$.ajax({
				   	url:url,
					method:'POST',
				   	data:{ "_id":$(target).siblings('div')[0].innerHTML,
							"value":value+1
						}
				   })
					.done(function(data,statusText)
					{
						target.innerHTML=str.replace(/\d+/,value+1)
						alert('成功'+statusText)
					})
					.fail(function(data,statusText){
						alert('失败'+statusText)
					})
		})
		
	});
}
