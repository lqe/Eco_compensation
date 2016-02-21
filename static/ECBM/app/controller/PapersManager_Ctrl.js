//HT.controller.UserController类的定义
Ext.define('ECBM.controller.PapersManager_Ctrl',{
	extend:'Ext.app.Controller',
	stores:['PapersManager.research_report_Store'],
	models:['PapersManager.research_report_Model'],
	views:[
		'PapersManager.research_report',
		
		],
	//refs:[//相当于一个映射，这样可以在控制层跟方便的通过geter取得相应的对象
	//],
	init:function(){
		this.control({
			'#PapersManager':{itemclick:this.AddMainPanel}				//监听id="ArticleManager"的事件
		});
	},
	AddMainPanel:function(view,record,item,index,e){
		if(record.data.leaf){
			var tabPanel = Ext.getCmp('MainPanel');
			var id=record.data.id										//被点击的结点的id
			if(!Ext.getCmp(id)){
				switch(id){
					case 'research_report':
						config={
								id :record.data.id,
								title:record.data.text,	
								layout:'fit',
								xtype:'research_report',
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