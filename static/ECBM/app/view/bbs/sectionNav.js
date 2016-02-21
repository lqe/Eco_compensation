//节点  右键菜单
Ext.define('My.sectionNodeMenu',{
	extend:'Ext.menu.Menu',
	record:null,
	tree:null,
	constructor: function(_cfg){
		Ext.apply(this,_cfg,{
			items:[
				{text:'版块详情',handler:this.showInfo,scope:this},
				{text:'修改信息',handler:this.editInfo,scope:this},
				{text:'删除版块',handler:this.delInfo,scope:this}
			]
		})
		this.callParent();
	},
	getItem:function(fun){
		formItems=[ {fieldLabel:'组ID',name:'GId',hidden:true},
					{fieldLabel:'板块名称',name:'SName'},
					{fieldLabel:'版主编号',name:'SMasterId'},
					{fieldLabel:'点击次数',name:'SClickCount',xtype:'numberfield'},
					{fieldLabel:'创建时间',name:'STime'},
					{fieldLabel:'版块说明',name:'GStatement',
						labelAlign:'top',
						labelStyle:"padding-bottom:10px",
						xtype:'htmleditor'
					}]
		for(var i=0;i<formItems.length;i++){
					formItems[i].readOnly=true
				}
		switch(fun){
			case 'show':
				for(var i=0;i<formItems.length;i++){
					formItems[i].allowBlank=true
				}
				break;
			case 'edit':
				formItems[1].readOnly=false
				formItems[2].readOnly=false
				formItems[5].readOnly=false
				break;
		};
		return formItems
	},
	editInfo:function(item,e){
		if(!this.record)return
		var me=this;
		var Win=Ext.create('ECBM.view.ul.MyWindow',{
			title:'修改版块信息',
			url:'/bbs/section/edit',
			refreshXtype:'sectionNav',
			formItems:me.getItem('edit')
		})
		Win.down('form').load({
		        url : "/bbs/section/get",
		        method:'POST',
                params : {
                		_id :me.record.raw._id
                },	
		        success : function(form,action) {
		        	Win.show()
		        },
		        failure : function(form,action) {
		            Ext.Msg.alert('加载失败',action.result?action.result.msg:" 服务器相应出现错误！")
		         }	
		 }) 
	},
	showInfo:function(item,e){
		if(!this.record)return
		var me=this;
		var Win=Ext.create('ECBM.view.ul.MyWindow',{
			title:'显示版块信息',
			closable:true,
			dockedItems:[],
			formItems:me.getItem('show')
		})
		Win.down('form').load({
		        url : "/bbs/section/get",
		        method:'POST',
                params : {
                		_id :me.record.raw._id
                },	
		        success : function(form,action) {
		        	Win.show()
		        },
		        failure : function(form,action) {
		            Ext.Msg.alert('加载失败',action.result?action.result.msg:" 服务器相应出现错误！")
		         }	
		 }) 
	},
	delInfo:function(item,e){
		var me=this
		Ext.Msg.confirm("提示", "您确定要删除这个版块", function(btn, text) {
			if (btn == 'yes') {
            	Ext.Ajax.request({
	                url : "/bbs/section/del",
	                params : {_id :me.record.raw._id},
	                method : "POST",
					waitMsg : '正在删除,请稍候...',
			        success : function(response) {
			        	var json = response.responseText
			        	var dict=Ext.JSON.decode(json)
			        	alert(dict["msg"])
			        	me.tree.getStore().treeStore.load()
			        	//Ext.ComponentQuery.query('sectionNav')[0].getStore().load()
			        },
			        failure : function(response) {
			            alert("发送失败")
			         }
	            });
			}
		})
	}//end
})
//文件夹   右键菜单
Ext.define('My.sectionFolderMenu',{
	extend:'Ext.menu.Menu',
	record:null,
	tree:null,
	constructor: function(_cfg){
		Ext.apply(this,_cfg,{
			items:[{
				text:'设为或取消精选组',handler:this.editGroup,scope:this
			},{
				text:'删除本分组',handler:this.delGroup,scope:this
			},{			
				text:'添加子版块',handler:this.addSection,scope:this
			}]
		})
		this.callParent();
	},
	editGroup:function(){
		var me=this
    	Ext.Ajax.request({
            url : "/bbs/group/edit",
            params : {
            '_id' :me.record.raw._id,
            'GFeatured':me.record.raw.GFeatured? false: true
            },
            method : "POST",
			waitMsg : '设置中,请稍候...',
	        success : function(response) {
	        	var json = response.responseText
	        	var dict=Ext.JSON.decode(json)
	        	alert(dict["msg"])
	        	me.tree.getStore().treeStore.load()
	        	//Ext.ComponentQuery.query('sectionNav')[0].getStore().load()
	        },
	        failure : function(response) {
	            alert("设置失败")
	         }
        });
	},
	delGroup:function(){
		var me=this
		Ext.Msg.confirm("提示", "您确定要删除本组（包含所有版块）信息吗?", function(btn, text) {		//确认删除
       	 	if (btn == 'yes') {
            	Ext.Ajax.request({
	                url : "/bbs/group/del",
	                params : {_id :me.record.raw._id},
	                method : "POST",
					waitMsg : '正在删除,请稍候...',
			        success : function(response) {
			        	var json = response.responseText
			        	var dict=Ext.JSON.decode(json)
			        	alert(dict["msg"])
			        	me.tree.getStore().treeStore.load()
			        	//Ext.ComponentQuery.query('sectionNav')[0].getStore().load()
			        },
			        failure : function(response) {
			            alert("发送失败")
			         }
	            });
      	  }
	   });
	},
	addSection:function(){
		var me=this;
		if (!me.record.raw._id) return		//所在组的id 不能为空
		var time=Ext.Date.format(new Date(),"Y-m-d H-i-s").toString();
		var win=Ext.create('ECBM.view.ul.MyWindow',{
			title:'增加版块',
			url:'/bbs/section/add',
			refreshXtype:'sectionNav',
			formItems:[
				{fieldLabel:'组ID',name:'GId',value:me.record.raw._id,hidden:true},
				{fieldLabel:'板块名称',name:'SName'},
				{fieldLabel:'版主编号',name:'SMasterId',
					xtype:'combobox',
					forceSelection:true,
					displayField:'name_id',
					valueField:'name_id',
					queryMode:'local',
					store:Ext.create('Ext.data.Store',{
						fields:['name_id'],
						proxy:{
							type:'ajax',
							url:'/admin/get?collection=personnel_info',
							reader:{
								type:'json',
								root:'data'
							}
						},
						autoLoad:true
					}),
				},
				{fieldLabel:'点击次数',name:'SClickCount',
					xtype:'numberfield',
					value:0,
					readOnly:true},
				{fieldLabel:'创建时间',name:'STime',
					value:time,
					readOnly:true},
				{fieldLabel:'版块说明',name:'SStatement',
					labelAlign:'top',
					labelStyle:"padding-bottom:10px",
					xtype:'htmleditor'
				}
			]
		}).show()
	}
})

//定义Model
Ext.define('sectionNavModel',{
	extend:'Ext.data.Model',
	fields:[
		{name:'id',mapping:'_id'},
		{name:'text',type:'string',mapping:'GName'},
		{name:'children',type:'string',mapping:'GSection'},
		{name:'leaf',type:'bool'},
		{name:'GTime',type:'string'},
		{name:'GFeatured',type:'boolean'}
	]
});

Ext.define('ECBM.view.bbs.sectionNav',{
	extend:'Ext.tree.Panel',
	alias:'widget.sectionNav',
	id:'sectionNavID',
	rootVisible:true,
	tools:[
		{	id:'help',
			tooltip:'帮助信息',
			handler:function(event,toolEl,panel){
				alert('此面板由于管理所有版块')
			}
		},{	id:'plus',
			tooltip:'添加分组'
		}],
	initComponent:function(){
		var treeStore=Ext.create('Ext.data.TreeStore',{
			model:'sectionNavModel',
			root:{
					text:'分组列表',
					id:'root'
			},
			proxy:{
				type:'ajax',
				method : 'GET',
				url : 'bbs/group/get', 	//待设置
				reader:{
					type:'json',
					root:'data',
					//totalProperty:'total'
					}
				}
		});
		treeStore.load()
		this.store=treeStore
		this.callParent(arguments)
	},
	listeners:{
		expand:function(pan,e){
			alert("expanel")
		}
	}
})
