Ext.define('ECBM.view.MainPanel',{
	extend:'Ext.TabPanel',
	alias:'widget.MainPanel',
	initComponent:function(_cfg){
		Ext.apply(this,_cfg,{
			id: 'MainPanel',
			region : 'center',
			header:false,
			autoScroll:true,
			defaults:{
				autoScroll:true
			},
			activeTab:0,
			items:[{
				title : '我的首页',
				html : '<div>欢迎进入后台管理界面~</div>'	
			}]
		});
		this.callParent();
	}
})