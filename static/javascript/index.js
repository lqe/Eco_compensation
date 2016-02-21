window.onload = function(){
			index.app.PicMove();
			index.app.newsMove();
			index.app.chart();
		};
var index={}
index.app={}
index.app.chart=function()
{
	var rgt=Ext.fly('right')
	var store = Ext.create('Ext.data.JsonStore', {
		fields: [{name:'name',mapping:'_id'},
				 {name:'data',mapping:'total'}],		   
		proxy:new Ext.data.HttpProxy({
				method : 'GET',
				url : '/bbs/section/getStore', 	//待设置
				reader:{
					type:'json',
					root:'data',
					}
			}),
			autoLoad:true
		})
	
	Ext.create('Ext.chart.Chart', {
		width: 250,
		height: 250,
		animate: true,
		store: store,
		renderTo:Ext.fly('right'),
		theme: 'Base:gradients',
		series: [{
			type: 'pie',
			angleField: 'data',
			showInLegend: true,
			tips: {
				trackMouse: true,
				width: 140,
				height: 28,
				renderer: function(storeItem, item) {
					// calculate and display percentage on hover
					var total = 0;
					store.each(function(rec) {
						total += rec.get('data');
					});
					str="<a href='\bbs'></a>"
					this.setTitle(storeItem.get('name') + '访问量: ' + storeItem.get('data'));
				}
			},
			highlight: {
			},
			label: {
				field: 'name',
				display: 'rotate',
				contrast: true,
				font: '18px Arial',
				renderer:function(v){
					return  v 
				}
			}
		}]
	});
	
	
	
}
index.app.newsMove=function(){
	var element=$('#recent_newsul')
	var i=10.0
	var time=40
	var fn=function(){
		var top=i+'px'
		element.css('top',top)
		if (i<=-200) i=268
		else i-=1
	}
	var f=setInterval(fn,time);
	element.bind('mouseover',function(){
		clearInterval(f)
	})
	element.bind('mouseout',function(){
		f=setInterval(fn,time);
	})
};
index.app.PicMove=function(){
	var newPic =new Image();
	var i=$('.picture').find('span')
	var Img=$('.picture').find("img");
	var num=1;
	setTimeout(auto,6000);
 	function auto(){
		
		newPic.src='../static/images/picture'+num+'.jpg';
		i.each(function(index, element) {
			if (index==num-1) {
				element.style.background='#fff';
				element.style.color='#000'
			}else{
				element.style.background='#999';
				element.style.color='#000'
				}
        });
		Img.attr('src',newPic.src);
		num=(num++)%3+1;
		setTimeout(auto,6000);
		};	
	i.each(function(index, element) {
		$(this).click(function(){
			i.each(function(ix, et) {
				if (ix==index) {
					et.style.background='#fff';
					et.style.color='#000'
				}else{
					et.style.background='#999';
					et.style.color='#000'
				}
			})
			Img.attr('src','../static/images/picture'+(index+1)+'.jpg');
			num=index+1
			})
		})
	}