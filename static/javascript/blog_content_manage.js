 // JavaScript Document
//U1.js的分层（功能）：jquery（tools） 组件（ui） 应用层（app） mvc（backboneJs）
//js的规划（管理）：避免全局变量和方法（命名空间，闭包，面向对象），模块化（seaJs ,requireJs）
window.onload = function(){
			common.app.sys('sysmsg')
			common.app.pagenoSkip()
			blog_content_blog.app.CRUD()
			blog_content_blog.app.classification()
		};
		
var blog_content_blog = {}; //命名空间
blog_content_blog.tools = {};
blog_content_blog.ui = {};
blog_content_blog.app  = {};

//tools
//ui 
//app
blog_content_blog.app.classification=function(){
	index=window.location.href.indexOf("classification" )
	if (index>-1){
		beg=window.location.href.indexOf("=",index) + 1
		end=window.location.href.indexOf("&",index)
		if (end > -1)
			text=window.location.href.substring(beg,end)
		else
			text=window.location.href.substring(beg)
		$(".pagenoSkip a").each(function(index,a){
				hrefTemp=a.href.replace("?","?classification="+text+'&&')
				a.href=hrefTemp
			})
		pagenoSkipBtn=$("#url")
		url=pagenoSkipBtn.html()
		pagenoSkipBtn.html(url.replace("?","?classification="+text+'&&'))
	}
}
blog_content_blog.app.CRUD=function(){
	items=$(".right1_content_CRUD")
	items.each(function(Qindex,item){
		fct=$(this).find("cite")
		fct.each(function(index,i){
			me=$(this)
			html=me.html()
			if (html=='编辑'){
				me.click(function(){
					_id=$("._id")[Qindex].innerHTML
					window.location.href='/write_blog?_id='+_id
				})
			}
			else if(html=="删除"){
				me.click(function(){
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
	})
}

blog_content_blog.app.Go=function(){
	
}
