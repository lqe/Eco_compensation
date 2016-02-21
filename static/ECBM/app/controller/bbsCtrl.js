//HT.controller.UserController类的定义
Ext.define('ECBM.controller.bbsCtrl',{
	extend:'Ext.app.Controller',
	require:[
		'ECBM.view.ul.MyWindow'
	],
	views:[
			'bbs.topic',
			'bbs.sectionNav',
			'bbs.section',
			],
	//相当于一个映射，这样可以在控制层跟方便的通过geter取得相应的对象
	refs:[	
		{ref:'bbsManager',selector:'#BbsManager'}
	],
	init:function(){
		this.control({
			'#BbsManager':{itemclick:this.AddMainPanel},			//监听id="ArticleManager"的事件
			'#sectionNavID':{itemclick:this.topicShow,
							itemcontextmenu:this.sectionInfoCURD},
			'#plus':{click:this.addGroup}
							
		});
	},
	//增加 版块的分组
	addGroup:function(item,evt){
		var me=this;
		var win=Ext.create('ECBM.view.ul.MyWindow',{
			title:'增加分组',
			url:'/bbs/group/add',
			refreshXtype:'sectionNav',
			formItems:[
				{fieldLabel:'新增组名',name:'GName'}
			]
		})
		win.show()
	},
	//节点右键,显示对节点的操作
	sectionInfoCURD:function(tree,record,item,index,evt){
		var _id=record.raw._id ? record.raw._id : record.raw.id;
		var cfg={tree:tree,record:record};
		if(record.data.leaf){
			var NodeMenu=Ext.create('My.sectionNodeMenu',cfg);
			NodeMenu.showAt(evt.getPoint());
		}
		else if(_id!='root'){
			var FolderMenu=Ext.create('My.sectionFolderMenu',cfg);
			FolderMenu.showAt(evt.getPoint());
		}
		evt.stopEvent();
	},
	//点击选择版面，显示所有主帖子
	topicShow:function(view,record,item,index,e){
		if(!record.data.leaf) return
		var topPanel = Ext.getCmp('topicID');
			topPanel.getStore().load({
				params:{
					SName:record.raw.GName  //GName实际上是SName的值 
				}
			})
	},
	AddMainPanel:function(view,record,item,index,e){
		if(record.data.leaf){
			var tabPanel = Ext.getCmp('MainPanel');
			var id=record.data.id										//被点击的结点的id
			if(!Ext.getCmp(id)){
				var item=[]
				switch(id){
					case 'section':
						item=[{xtype:'section'}];
						break;
					case 'oobulletin':
						item=[{xtype:'bulletin'}];
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