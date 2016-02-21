 // JavaScript Document
//U1.js的分层（功能）：jquery（tools） 组件（ui） 应用层（app） mvc（backboneJs）
//js的规划（管理）：避免全局变量和方法（命名空间，闭包，面向对象），模块化（seaJs ,requireJs）
window.onload = function(){
	switch(document.title){
		case 'BBS导航':
			bbsNav.TreeInit();
			bbsNav.clickEvent();
			bbsNav.logg();
			break;
		case 'BBS内容':
			bbsContent.picPicMove();
			break;
		case 'BBS列表':
			bbsTopic.Paging()
		case 'BBS论坛':
			break;
		}
};

var bbsNav = {}; //命名空间
var bbsContent={};
var bbsTopic={};
//主题分页
bbsTopic.Paging=function()
{
	//获取当前的页
	currentPage=parseInt(window.location.href.match(/page=(-{0,1}\d+)&/)[1])
	//获取最大页数
	maxPage=parseInt($('.maxPage').attr('href').match(/page=(-{0,1}\d+)&/)[1])
	if (currentPage >= 4 && currentPage<=maxPage-3){
		$('.Page').each(function(index)
		{
			var value=currentPage+index-2
			var replaceText="page="+value.toString()+"&"
			hf=$(this).attr('href')
			hf=hf.replace(/page=(-{0,1}\d+)&/,replaceText)
			$(this).attr('href',hf).text(value)
		})
	}
}
//设备展示 实现照片的移动
bbsContent.picPicMove = function(){
	var timer = setInterval(display,20);
	var lens=$('#pic').find('img').length * 120;
	var $picContent=$('#picContent')
	var $picContentParent=$picContent.parent()
	$picContent.css('width',$picContentParent.css('width'));
	$picContent.css('height',$picContentParent.css('height'));
	$('#picCopy').css('left',-lens-10);
	var picX=0 ,picCopyX=-lens;
	
	function display(){
		var width=$('#picContent').parent().css('width')
		var value=parseInt(width.substr(0,width.length-2))
		if(picX>value) picX=-lens
		if(picCopyX>value) picCopyX=-lens
		picX+=1;
		picCopyX+=1;
		$('#pic').css('left',picX);
		$('#picCopy').css('left',picCopyX);
		};
	$('#pic').find('a').hover(
		function(){
			clearInterval(timer);
			},
		function(){
			timer = setInterval(display,20);
			}
		);
};//End

bbsNav.logg=function(){
	
	$("#login").bind("click"
				   ,function(event){
					   var loc=window.parent.location;
					   loc.href="/login?url="+loc.pathname+loc.search.replace(/&&|&/g,"+")+"&fun=login"
					   });
	$("#register").bind("click"
			   ,function(event){
				   var loc=window.parent.location;
				   loc.href="/login?url="+loc.pathname+loc.search.replace(/&&|&/g,"+")+"&fun=register"
				   });
	$("#logout").bind("click"
		   ,function(event){
			   window.parent.location.href="/reset/$logged()"
			   })
	}
//初始化树形导航结构
bbsNav.TreeInit=function(){
	$("#browser").treeview({
			collapsed: true,
		});
	}
	
//节点点击事件
bbsNav.clickEvent=function(){
	var frameName="bbs_content";
	$(".file").bind("click"
		,function(event)
	{
		var me=this;
		var url="/bbs?htmlName="+frameName+"&&page=1&&SName="+ me.innerHTML
		window.parent.frames[frameName].location.replace(url)
		
	});
};//end clickEvent



