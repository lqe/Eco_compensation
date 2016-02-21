//HT.controller.UserController类的定义
Ext.define('ECBM.controller.SystemManager_Ctrl',{
	extend:'Ext.app.Controller',
	stores:['SystemManager.personnel_info_Store'],
	models:['SystemManager.personnel_info_Model'],
	views:[
		'SystemManager.personnel_info' ,
		'Ext.ux.form.SearchField'
		],
	//refs:[//相当于一个映射，这样可以在控制层跟方便的通过geter取得相应的对象
	//],
	init:function(){
		this.control({
			'#SystemManager':{itemclick:this.AddMainPanel}				//监听id="ArticleManager"的事件
		});
	},
	AddMainPanel:function(view,record,item,index,e){
		if(record.data.leaf){
			var tabPanel = Ext.getCmp('MainPanel');
			var id=record.data.id										//被点击的结点的id
			if(!Ext.getCmp(id)){
				switch(id){
					case 'personnel_info':
						config={
								id :record.data.id,
								title:record.data.text,	
								layout:'fit',
								xtype:'personnel_info',
								closable:true
							}
						var tab = tabPanel.add(config);
						break;
				}
			}
			tabPanel.setActiveTab(record.data.id);
		};
	}//AddMainPanel
});