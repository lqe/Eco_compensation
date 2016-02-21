Ext.define('ECBM.view.articles.contact',{
	extend:'Ext.grid.Panel',
	alias:'widget.contact',
	//可以传递参数_cfg 用于配置此对象 第一步
	constructor: function(_cfg){
		config={
			store:'articles.contact_Store',
			id:'contact',
			columns:[
					{text : '序号',	xtype: 'rownumberer',width:30}, 
					{text : '电话',	dataIndex : 'phone',flex:1}, 
					{text : '地址',	dataIndex : 'address',flex:1},
					{text : '邮编', dataIndex : 'postId',flex:1},
					{text : '邮件',	dataIndex : 'email',flex:1},
					{text : '传真', dataIndex : 'fax',flex:1},
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
		this.bbar=[{
			xtype:'pagingtoolbar',
			store:'articles.contact_Store',		
			displayInfo:true,
	        displayMsg : '显示第{0}条数据到{1}条数据,一共有{2}条',
	        emptyMsg : "无数据"
		},'->',{
				    xtype : 'button',
				    text : '添加',
				    iconCls : "icon-add",
					handler:this.contact_add
				}]
		this.callParent(arguments);
	},
	
	editFn:function(grid,rowIndex,colIndex){
		if(typeof(editWin)=='undefined'){var editWin}
		var rec= grid.getStore().getAt(rowIndex)
		if(editWin){
			var formFields=editWin.items.get(0).items;
			formFields.get(0).setValue(rec.get('phone'))
			formFields.get(1).setValue(rec.get('address'))
			formFields.get(2).setValue(rec.get('postId'))
			formFields.get(3).setValue(rec.get('email'))
			formFields.get(4).setValue(rec.get('fax'))
			formFields.get(5).setValue(rec.get('_id'))
			
		}else{
			editWin=Ext.create('Ext.window.Window',{
				title:'联系方式编辑',
				items:[{
					xtype:'form',
					width:'100%',
					bodyPadding:10,
					defaultType:'textfield',
					items:[{
						fieldLabel:'联系电话',
						name:'phone',
						value:rec.get('phone')
					},{
						fieldLabel:'详细地址',
						name:'address',
						value:rec.get('address')
					},{
						fieldLabel:'邮编',
						name:'postId',
						value:rec.get('postId')
					},{
						fieldLabel:'邮箱',
						name:'email',
						value:rec.get('email')
					},{
						fieldLabel:'传真号',
						name:'fax',
						value:rec.get('fax')
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
								url:'/admin/edit?category=contact_way',
								success:function(form,action){
									editWin.hide()
									Ext.getCmp('contact').store.reload();
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

	contact_add:function(){
		addWindow=Ext.create('Ext.window.Window',{
				title:'联系方式编辑',
				items:[{
					xtype:'form',
					width:'100%',
					bodyPadding:10,
					defaultType:'textfield',
					items:[{
						fieldLabel:'联系电话',
						name:'phone'
					},{
						fieldLabel:'详细地址',
						name:'address'
					},{
						fieldLabel:'邮编',
						name:'postId'
					},{
						fieldLabel:'邮箱',
						name:'email'
					},{
						fieldLabel:'传真号',
						name:'fax'
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
								url:'/admin/add?category=contact_way',
								success:function(form,action){
									addWindow.hide();
									Ext.getCmp('contact').store.reload();
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
		        	alert(dict)
		        	Ext.getCmp('contact').store.load();
		        	
		        },
		        failure : function(response) {
		            alert("元数据获取失败")
		            }
	    });	
		}
	}
})


