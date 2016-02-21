 // JavaScript Document
//U1.js的分层（功能）：jquery（tools） 组件（ui） 应用层（app） mvc（backboneJs）
//js的规划（管理）：避免全局变量和方法（命名空间，闭包，面向对象），模块化（seaJs ,requireJs）

var common = {}; //命名空间
common.tools = {};
common.ui = {};
common.app  = {};

//tools
//ui
//flag标签按钮单击是 跳转到URL页面
common.ui.ButtonClick = function(flag,url){
		$(flag).click(function(){
		document.location.href=(url);
		});
};
//common.app.setCursorByID('btn','mousemove','pointer') 鼠标在id=btn的元素上mousemove 时 变成手的形状
common.ui.setCursorByID=function (id,pattern,cursorStyle) {
  flag=$('#'+id)
  flag.bind(pattern,function(){flag.css('cursor',cursorStyle)})

}
 
//app


//检测输入的查找的页数是否合理  并跳转到url= href+'&&skip='+skip+'&&pageno='+pageno
common.app.pagenoSkip = function(){	
	/*在HTML页面中要有
       	<p id="vars" style="display:none;">$limit,$size</p>
        <p id="url" style="display:none;">/banner?category=$category,limit=$limit,name=$name</p>
   */
	$('.pagenoSkip').find('#but').click(function(){
		$text=$('.pagenoSkip').find('#pageno');
		page=$text[0].value;
		if(isNaN(page)==true){
	 		alert('Plase enter a vaild');
	 		$text.focus();
	 		$text.select();
		}
		else{
			// 从.pagenoSkip span的标签中获取 总的页数 str=$('.pagenoSkip').find('span').html(); myRegExp= new RegExp('/\\d'); totalpage=parseInt(str.match(myRegExp)[0].substring(1))*/
			str=$('.pagenoSkip').find('#vars').html();
			varsy=str.split(',');
			page=parseInt(page);
			if(page>0 && page<= parseInt(varsy[1])){
				urls=$('.pagenoSkip').find('#url').html();
				urls=urls.split(',');
				href=urls[0];
				for(var i = 1 ; i<urls.length;i++){
					href+=('&&'+urls[i]);
				};
				skip = varsy[0] * (page - 1);				
				document.location.href=(href+'&&skip='+skip+'&&page='+page);
			}
			else{
				alert('超出范围');
	 			$text.focus();
	 			$text.select();
			}
		}
	});
};//End

//设置id的内容，此处设置页脚
common.app.sys=function(id){
   if(navigator.appName=='Microsoft Internet Explorer'){
      document.getElementById(id).innerHTML='您使用的浏览器是微软公司的IE浏览器<br />';
   }
       document.getElementById(id).innerHTML+='您的屏幕分辨率为'+screen.width+'×'+screen.height;
  };
common.app.addFav =function(title) {
    var url=location.href;
    if (window.sidebar) { 
        window.sidebar.addPanel(title, url,""); 
       } else if( document.all ) {
        window.external.AddFavorite( url, title);
       } else if( window.opera && window.print ) {
        return true;
      }
   }