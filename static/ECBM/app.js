Ext.onReady(function(){
	//Ext.BLANK_IMAGE_URL="../static/ECBM/extjs/resources/OnePx.gif"
	Ext.QuickTips.init();
	Ext.tip.QuickTipManager.init();
	Ext.Loader.setConfig({
		enabled:true
	});
	Ext.Loader.setPath('Ext.ux', 'static/ECBM/extjs/ux');
	Ext.application({
		name:'ECBM',
		appFolder:'../static/ECBM/app',
		controllers:[
			'Article_Ctrl',
			'SystemManager_Ctrl',
			'PapersManager_Ctrl',
			'bbsCtrl'
		],
		autoCreateViewport:true,
		launch:function(){}
	});
})

/*Ext.onReady(function(){
	new Ext.FormPanel({
		frame:true,
		bodyStyle:'padding:10px',
		defaultType:'textfield',
		defaults:{
			lableWidth:75,
			labelAlign:'right',
		},
		items:[{
			fieldLabel:'aa',
			name:'title',
			plugins:['tip'],
			msg:'sssssssssssssss'
		}]
	}).render(document.body)
})*/
/*插件用于 鼠标移过组件时，显示提示信息
 * eg:items:[{
			fieldLabel:'标题',
			name:'title',
			plugins:['MyPlugin_tip'],
			xtype:'textfield',
			msg:'提示信息'
		}
 * */
Ext.define('MyPlugin_tip',{
	extend:'Ext.AbstractPlugin',
	alias:'plugin.MyPlugin_tip',
	init:function(f){
		this.field=f;
		if(f.msg){
			this.tips=new Ext.ToolTip({
				html:'<div style="margins:0px 0px 0px2px">'+f.msg+'</div>'
			});
			f.on('afterrender',this.initTips,this);
		}
	},
	initTips:function(){
		this.field.el.on('mouseover',this.showTips,this)
		this.field.el.on('mouseout',this.hideTips,this)
	},
	showTips:function(e,t,o){
		if(this.tips)this.tips.showAt(e.getXY())
	},
	hideTips:function(e,t,o){
		if(this.tips)this.tips.hide();
	}
})

/**/

Ext.define('MyPlugin_CRUD',{
	extend:'Ext.AbstractPlugin',
	alias:'plugin.MyPlugin_CRUD',
	init:function(view){
		this.parent=view;
		if (!view.tbar){
			console.log(view)
			console.log(view.tbar)
		}
	}	
})






