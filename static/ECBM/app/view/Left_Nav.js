
Ext.define('ECBM.view.Left_Nav',{
	extend:'Ext.panel.Panel',
	alias:'widget.Left_Nav',
	//可以传递参数_cfg 用于配置此对象 第一步
	constructor: function(_cfg){
	Ext.apply(this, _cfg,{
			region: 'west',
			title: '功能菜单', 
			form:true,
			width: 200,  
			split: true,  
			collapsible: true, 
			layout:{
				type:'accordion'
				}
		});
		this.superclass.constructor.call(this);
	},
	//初始化组件   第二步
	initComponent:function(){
		this.items=[
			{
				title:'文章管理',
				xtype:'treepanel',
				id:'ArticleManager',
				expanded : true,
				rootVisible:false,
				root:{
					text : "文章管理",
					expanded : false,
					children : [ 
						{id : "plat",			text : "平台简介",	leaf : true }, 
						{id : "policies",		text : "政策法规",	leaf : true}, 
						{id : "meeting_dynamic",text : "会议动态",	leaf : true},
						{id : "contact_way",	text : "联系方式",	leaf : true},
						{id : "co_website",		text : "合作网站",	leaf : true}
					]}
			},{
					title:'资料管理',
					xtype:'treepanel',
					id:'PapersManager',
					rootVisible:false,
					root:{
						text : "资料管理",
						expanded : false,
						children : [
							{id : "research_report",text : "研究报告管理",leaf : true}, 
							//{id : "conference_papers",text : "会议论文管理",leaf : true},
							//{id : "other_document",text : "其它文献管理",leaf : true}
							]
					}		
			},{
					title:'BBS论坛管理',
					xtype:'treepanel',
					id:'BbsManager',
					rootVisible:false,
					root:{
						text : "BBS论坛管理",
						expanded : false,
						children : [
							{id : "bulletin",text : "公告管理",leaf : true},
							{id : "section",text : "版块管理",leaf : true}
							]
					}
			},/*{
					title:'数据库管理',
					xtype:'treepanel',
					id:'DataManager',
					rootVisible:false,
					root:{
						text : "数据库管理",
						expanded : false,
						children : [
							{id : "case_management",text : "案列数据库管理",leaf : true}, 
							{id : "policy_management",text : "政策法规管理",leaf : true}
							]
					}
			},*/{
					title:'系统管理',
					xtype:'treepanel',
					id:'SystemManager',
					rootVisible:false,
					expanded : false,
					root:{
						text : "会议管理",
						expanded : true,
						children : [
							{id : "personnel_info",text : "用户管理",leaf : true}
							]
					}
			}];
		this.callParent();
	}
});



