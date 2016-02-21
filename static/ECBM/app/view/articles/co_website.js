Ext.define('ECBM.view.articles.co_website',{
	extend:'Ext.grid.Panel',
	alias:'widget.co_website',
	//可以传递参数_cfg 用于配置此对象 第一步
	constructor: function(_cfg){
		config={
			store:'articles.co_website_Store',
			id:'co_websiteID',
			columns:[
					{text : '序号',	xtype: 'rownumberer',width:30}, 
					{text : '名称',	dataIndex : 'name',flex:1}, 
					{text : '网址',	dataIndex : 'website',flex:1},
					{text : '邮件',	dataIndex : 'email',flex:1},
					{text : '序列号', dataIndex : '_id',hidden : true,flex:1},
					{
						text : '操作',
						xtype:'actioncolumn',
						width:50,
						items:[{
							iconCls : "icon-user_edit",
							tooltip:'编辑',
							handler:this.editFn
						},{
							iconCls : "icon-delete",
							tooltip:'删除',
							handler:this.deleteFn
						}]
					}
			]
		};
		Ext.apply(this, _cfg,config);
		this.superclass.constructor.call(this);
	},
	//初始化组件   第二步
	initComponent:function(){
		this.tbar=['->',{
				    xtype : 'button',
				    text : '添加',
				    iconCls : "icon-add",
					handler:this.co_website_add
				}];
		this.callParent(arguments);
	},
	
	editFn:function(grid,rowIndex,colIndex){
		if(typeof(editWin)=='undefined'){var editWin}
		var rec= grid.getStore().getAt(rowIndex)
		if(editWin){
			var formFields=editWin.items.get(0).items;
			formFields.get(0).setValue(rec.get('name'))
			formFields.get(1).setValue(rec.get('website'))
			formFields.get(2).setValue(rec.get('email'))
			formFields.get(3).setValue(rec.get('_id'))
			
		}else{
			editWin=Ext.create('Ext.window.Window',{
				title:'合作网站',
				items:[{
					xtype:'form',
					width:'100%',
					bodyPadding:10,
					defaultType:'textfield',
					items:[{
						fieldLabel:'名称',
						name:'name',
						value:rec.get('name')
					},{
						fieldLabel:'网址',
						name:'website',
						value:rec.get('website')
					},{
						fieldLabel:'邮箱',
						name:'email',
						value:rec.get('email')
					},{
						fieldLabel:'序号',
						name:'_id',
						hidden:true,
						value:rec.get('_id')
					}]
				}],
				listeners:{
					beforedestory:function(){
						this.hide();
						return false;
					}
				},
				bbar:[
				{xtype:'tbfill'},
				{
					text:'确定',
					handler:function(){
						var form=editWin.down('form').getForm();
						if(form.isValid()){
							form.submit({
								method:'POST',
								url:'/admin/edit?category=co_website',
								success:function(form,action){
									editWin.hide()
									Ext.getCmp('co_websiteID').store.reload();
								}
							})
						}
					}
				},
				{
					text:'取消',
					handler:function(){
						editWin.hide();
					}
				},
				{xtype:'tbfill'}]
			}).show()
		}
		
	},

	co_website_add:function(){
		addWindow=Ext.create('Ext.window.Window',{
				title:'合作网站',
				items:[{
					xtype:'form',
					width:'100%',
					bodyPadding:10,
					defaultType:'textfield',
					items:[{
						fieldLabel:'名称',
						name:'name'
					},{
						fieldLabel:'网址',
						name:'website'
					},{
						fieldLabel:'邮箱',
						name:'email'
					},{
						fieldLabel:'序号',
						name:'_id',
						hidden:true
					}]
				}],
				listeners:{
					beforedestory:function(){
						this.hide();
						return false;
					}
				},
				bbar:[
				{xtype:'tbfill'},
				{
					text:'确定',
					handler:function(){
						var form=addWindow.down('form').getForm();
						if(form.isValid()){
							form.submit({
								method:'POST',
								url:'/admin/add?category=co_website',
								success:function(form,action){
									addWindow.hide();
									Ext.getCmp('co_websiteID').store.reload();
								}
							})
						}
					}
				},
				{
					text:'取消',
					handler:function(){
						addWindow.hide();
					}
				},
				{xtype:'tbfill'}]
			}).show()
		
	},

	deleteFn:function(grid,rowIndex,colIndex){
		if(confirm("确认删除","您是否真的想删除该记录")){
			var rec= grid.getStore().getAt(rowIndex)
			Ext.Ajax.request({
				url:'/admin/del',
				method:'POST',
				params:{_id:rec.get("_id")},
				waitMsg : '正在发布,请稍候...',
		        success : function(response) {
		        	var json = response.responseText
		        	var dict=Ext.JSON.decode(json)
		        	Ext.getCmp('co_websiteID').store.load();
		        	
		        },
		        failure : function(response) {
		            alert("元数据获取失败")
		            }
	    });	
		}
	}
})


