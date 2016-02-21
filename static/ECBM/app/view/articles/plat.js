
Ext.define('ECBM.view.articles.plat',{
	extend:'Ext.Panel',
	alias:'widget.plat',
	//可以传递参数_cfg 用于配置此对象 第一步
	constructor: function(_cfg){
		config={
			layout:'fit'
		};
		Ext.apply(this, _cfg,config);
		ECBM.view.articles.plat.superclass.constructor.call(this);
	},
	//初始化组件   第二步
	initComponent:function(){
		me=this
		this._id=""
		this.bbar=[
			{xtype:'tbfill'},
			{text:'提交',handler : this.submit},
			{xtype:'tbfill'}
		];
		this.items=[{
				xtype:'MyHtmlEditor',
				plugins:[]
			}
		]
		Ext.Ajax.request({
			url:'/admin/get',
			method:'GET',
			params:{category:"plat"},
			waitMsg : '正在发布,请稍候...',
	        success : function(response) {
	        	var json = response.responseText
	        	var dict=Ext.JSON.decode(json)
	        	console.log(dict)
	        	console.log(dict["data"][0])
	        	dict["data"][0]["_id"]
	        	me._id=dict["data"][0]["_id"]
	        	console.log(dict["data"][0]["_id"])
	        	console.log(dict["data"][0]["content"])
	        	Ext.select("[name='content']").elements[0].innerHTML=dict["data"][0]["content"]
	        	
	        },
	        failure : function(response) {
	            alert("元数据获取失败")
	            }
	    });	
		
		this.callParent(arguments);
	},
	submit:function(btn){
 		Ext.Ajax.request({
			url:'/admin/edit',
			method:'POST',
			params:{ _id:btn.up("plat")._id,
					 category : "plat",
					 content:btn.up("plat").items.items[0].value
					 },
			waitMsg : '正在发布,请稍候...',
	        success : function(response) {
	        	var json = response.responseText
	        	var dict=Ext.JSON.decode(json)
	        	alert(dict['msg'])
	        },
	        failure : function(response) {
	            alert("数据跟新失败")
	            }
	    });	
	}
})