Ext.define('ECBM.view.MyGrid',{
	extend:'Ext.grid.GridPanel',
	alias:'widget.MyGrid',
	//可以传递参数_cfg 用于配置此对象 第一步
	config:{
			
		},
	constructor: function(cfg){
		
		Ext.apply(this, _cfg,{});
		this.initConfig(cfg);
		this.callParent(this);
	},
	//初始化组件   第二步
	initComponent:function(){
		this.autoHeight=true;
		this.stripeRows=true;
		this.viewConfig={
			forceFit:true
		};
		this.createStore();
		this.createColumns();
		this.createTbar();
		this.createBar();
		ECBM.view.MyGrid.superclass.initComponent.call(this);
	},
	createStore:function(){
		this.store=new Ext.data.Store({
			autoLoad:true,
			proxy:new Ext.data.MemoryProxy(this.data),
			reader:new Ext.data.A
		})
	},
	createColumns:function(){},
	createTbar:function(){},
	createBar:function(){}
});

