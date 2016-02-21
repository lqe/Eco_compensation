 // JavaScript Document
//U1.js的分层（功能）：jquery（tools） 组件（ui） 应用层（app） mvc（backboneJs）
//js的规划（管理）：避免全局变量和方法（命名空间，闭包，面向对象），模块化（seaJs ,requireJs）
window.onload = function(){
			name_id=$('#Htmlvar').html()
			blog_center.app.sys('sysmsg')
			blog_center.app.nav()
			blog_center.app.weather()
			blog_center.app.write_article()
			blog_center.app.show_all_content()
			common.app.pagenoSkip()
			//blog_center.app.SetBlogContent()
		};
var blog_center = {}; //命名空间
blog_center.tools = {};
blog_center.ui = {};
blog_center.app  = {};


//tools
//ui 
//app

blog_center.app.show_all_content=function(){
	var all=$(".blog_content")
	$(".show_all_content").click(function(){
		var value=$(this).attr("value")
		if (value=="展开全文"){
			var brief=$(this).parent("div")
			var all=$(this).parent("div").siblings(".blog_content")
			brief.hide()
			all.show()
		
		}else{
			var all=$(this).parent("div")
			var brief=$(this).parent("div").siblings(".brief_content")
			all.hide()
			brief.show()
		}
	})
}
blog_center.app.SetBlogContent=function(){
	var temps=$(".blog_content")
	for(var i = 0 ;len=temps.length;i++){
		temp[0].innerHTML=temp.html().substring(0,10)
	}

}
blog_center.app.write_article=function(){
	bg=$('.write_article').css('border')
	$('.write_article').mousemove(function(e) {
        $(this).css('border','1px solid')
    });
	$('.write_article').mouseleave(function(e) {
        $(this).css('border',bg)
    });
	$('.write_article').click(function(){
		 window.location.href="/write_blog?name_id="+name_id
	 })
	}
blog_center.app.weather=function(){
	date=new Date()
	month=date.getMonth()+1
	day=date.getDate()
	week=['日','一','二','三','四','五','六']
	ps=$(".weather_date>p")
	ps[0].innerHTML=month+'月'+day+'日'
	ps[1].innerHTML='星期'+week[date.getDay()]
	//获取当地省市
	//通过调用新浪IP地址库接口查询用户当前所在国家、省份、城市、运营商信息
	$.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js',function(){
			
   			if(typeof(remote_ip_info)!='undefined')ps[2].innerHTML=remote_ip_info.country+remote_ip_info.province;
   		});
	//class=temp 的标签中获取温度  设置在.temper中
	temp=$(".temp").html() 
	if(temp)$(".temper").html(temp.substring(0,temp.length-2));
}
blog_center.app.nav=function(){
	li=$('#nav>li')
	nextLis=$('#nav div li')
	li.each(function(index, element) {
		var div=$(this).next().not($("li"))
        this.onmouseover=function(){
		 element.style.background='#63f'
		 
		};
		this.onmouseout=function(){
		 element.style.background='#8DC45E'
		};
		this.onclick=function(){
			//显示隐藏的子菜单
			if (div.is(':hidden')){
					div.show();
				}
			else{
				div.hide();
				}
			//根据innerHTML设置点击事件
			switch (element.innerHTML){
				case '数据管理':{
					window.location.href="/admin?name_id="+name_id
					break;
				}
			
			}
		};
		
    });
	nextLis.each(function(index, element) {
        element.onmouseover=function(){
		 $(this).css('background','#6f0')
		};
		element.onmouseout=function(){
		 $(this).css('background','#fff')
		};
		element.onclick=function(){
			text=$(this).find("a").html()
			switch(text){
				case "我的博文":{
					window.location.href="/blog_content_manage?name_id="+name_id
					break;
				}
			}
		}
    });
	
	
	}
blog_center.app.sys=function(id){
   if(navigator.appName=='Microsoft Internet Explorer'){
      document.getElementById(id).innerHTML='您使用的浏览器是微软公司的IE浏览器<br />';
   }
       document.getElementById(id).innerHTML+='您的屏幕分辨率为'+screen.width+'×'+screen.height;
  };