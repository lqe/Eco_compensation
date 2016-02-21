//HT.controller.UserController类的定义
Ext.define('ECBM.controller.Article_Ctrl',{
	extend:'Ext.app.Controller',
	stores:['articles.policles_Store','articles.contact_Store','articles.co_website_Store','articles.meeting_dynamic_Store'],
	models:['articles.policles_Model','articles.contact_Model','articles.co_website_Model','articles.meeting_dynamic_Model'],
	views:[ 'ul.MyHtmlEditor',
			'Left_Nav','MainPanel',
			'articles.policies','articles.plat','articles.contact','articles.co_website','articles.meeting_dynamic'
			],
	//refs:[//相当于一个映射，这样可以在控制层跟方便的通过geter取得相应的对象
	//],
	init:function(){
		this.control({
			'#ArticleManager':{itemclick:this.AddMainPanel}				//监听id="ArticleManager"的事件
		});
	},
	AddMainPanel:function(view,record,item,index,e){
		if(record.data.leaf){
			var tabPanel = Ext.getCmp('MainPanel');
			var id=record.data.id										//被点击的结点的id
			if(!Ext.getCmp(id)){
				var item=[]
				switch(id){
					case 'plat':
						item=[{xtype:'plat'}];
						break;
					case 'policies':
						item=[{xtype:'policies'}];
						break;
					case 'meeting_dynamic':
						cfg={
							xtype:'meeting_dynamic',
							id :record.data.id,
							title:record.data.text,	
							layout:'fit',
							closable:true,
						};
						tab = tabPanel.add(cfg)
						tabPanel.setActiveTab(record.data.id);
						return 
						break;
					case 'contact_way':
						item=[{xtype:'contact'}];
						break;
					case 'co_website':
						item=[{xtype:'co_website'}];
						break;
				}
				var tab = tabPanel.add({
									id :record.data.id,
									title:record.data.text,	
									layout:'fit',
									closable:true,
									items:item});
			}
			tabPanel.setActiveTab(record.data.id);
		};
	}//AddMainPanel
});