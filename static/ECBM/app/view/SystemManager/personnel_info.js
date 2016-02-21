Ext.define('ECBM.view.SystemManager.personnel_info',{
	extend:'Ext.grid.Panel',
	alias:'widget.personnel_info',
	//可以传递参数_cfg 用于配置此对象 第一步
	constructor: function(_cfg){
		config={
			store:'SystemManager.personnel_info_Store',
			columns:[
					{header : '序号',		xtype:'rownumberer',	width:30},
					{header : '昵称',		dataIndex:'name_id',	flex:1  },
					{header : '姓名',		dataIndex:'name',		flex:1  }, 
					{header : '角色',		dataIndex:'role',		flex:1  }, 
					{header : '部门',		dataIndex:'department',	flex:1  }, 
					{header : '密码',		dataIndex:'password',	flex:1	}, 
					{header : '资料下载权限',dataIndex:'data_access',flex:1	,xtype: 'numbercolumn', format:'0' },
					{header : '积分', 		dataIndex:'credit',		flex:1	,xtype: 'numbercolumn', format:'0'},
					{header : '邮箱', 		dataIndex:'email',		flex:1	},
					{header : '通过', 		dataIndex:'pass',		flex:1	,
						renderer:function(val){
							if (val=='yes'){return "<span style='color:red;'>"+val+"</span>"}
							else{return "<span style='color:green;'>"+val+"</span>"}
						}
					},
					{header : '序列号', 		dataIndex : '_id',		hidden:true }
					]
		};
		Ext.apply(this, _cfg,config);
		this.superclass.constructor.call(this);
	},
		//初始化组件   第二步
	initComponent:function(){
			this.tbar=[{
				    xtype : 'button',
				    text : '添加',
				    iconCls : "icon-add",
					handler:this.personnel_add
				}, '-', {
				    xtype : 'button',
				    text : '删除',
				    iconCls : "icon-delete",
				    handler:this.personnel_del
				}, '-', {
				    xtype : 'button',
				    text : '修改',
				    iconCls : "icon-user_edit",
				    handler:this.personnel_edit
			 	}]
		// 页面切换按钮
		this.bbar=[{
			xtype:'pagingtoolbar',
			store:'SystemManager.personnel_info_Store',		
			displayInfo:true,
	        displayMsg : '显示第{0}条数据到{1}条数据,一共有{2}条',
	        emptyMsg : "无数据"
		}]
		this.callParent(arguments);
	},
	personnel_add:function(){
	    var MyWindow=new Ext.Window({
				title:'人员管理',
				items:[{
					xtype:'form',
					width:'100%',
					bodyPadding:10,
					defaultType:'textfield',
					items:[{
						fieldLabel:'昵称',
						name:'name_id'
					},{
						fieldLabel:'姓名',
						name:'name'
					},{
						fieldLabel:'角色',
						name:'role'
					},{
						fieldLabel:'部门',        
						name:'department'
					},{
						fieldLabel:'密码',
						name:'password'
					},{
						fieldLabel:'资料下载权限',
						name:'data_access'
					},{
						fieldLabel:'积分',
						name:'credit'
					},{
						fieldLabel:'邮箱',
						name:'email'
					},{
						fieldLabel:'序列号',
						name:'_id',
						hidden:true
					}]
				}],
				buttons : [{
				        text : '确定',
				        handler:function(){
				        	var form = MyWindow.down('form').getForm()
				        	if (form.isValid()) {
				        		form.submit({
						            url : '/admin/add?collection=personnel_info',
						            waitTitle : '提示',
						            params:{category:"policies"},
						            method : 'POST',
						            waitMsg : '正在发布,请稍候...',
							        success : function(response) {
							        	MyWindow.hide()
							        	Ext.Msg.alert("信息", "发布成功！", function() {
		                        					Ext.getCmp('personnel_info').store.load();
		                   				 });
							        },
							        failure: function(form, action) {                                          
                                        Ext.MessageBox.alert('提示', action.result.msg);  
                                        return;  
                                    },  
                                    scope: this 
						        });
				        	}
						 }
				    }, {
				        text : '重置',
				        handler : function() {
				        	MyWindow.down('form').getForm().reset()
				        }
				    }, {
				        text : '取消',
				        handler : function() {
				        	MyWindow.down('form').getForm().reset()
				        	MyWindow.hide()
				        }
				    }]
		}).show();//MyWindow
	},//personnel_add
	
	personnel_del:function(view){
		var form=view.up('personnel_info')
		var SelectedRow=form.getSelectionModel().selected.items[0]  			//获取选中的行的容器
		if (!SelectedRow){															//没选中行  提示
			return Ext.MessageBox.show({
				title:'提示',
				msg:'请选择一条数据',
				buttons:Ext.Msg.YES
			});
		}
		var rowIndex=SelectedRow.index
		//ActivePanel.getSelectionModel().selectRow(rowIndex);
		Ext.Msg.confirm("提示", "您确定要删除这些信息吗?", function(btn, text) {		//确认删除
       	 	if (btn == 'yes') {
        		var _id = SelectedRow.data._id;
            	Ext.Ajax.request({
	                url : "/admin/del?collection=personnel_info",
	                params : {_id : _id},
	                method : "POST",
					waitMsg : '正在删除,请稍候...',
			        success : function(response) {
			        	var json = response.responseText
			        	var dict=Ext.JSON.decode(json)
			        	alert(dict["msg"])
			        	form.store.load();
			        },
			        failure : function(response) {
			            alert("发送失败")
			         }
	            });
      	  }
	   });
	},//personnel_del
		
	personnel_edit:function(view){
		var formpanel=view.up('personnel_info')
		var SelectedRow=formpanel.getSelectionModel().selected.items[0]  			//获取选中的行的容器
		if (!SelectedRow){															//没选中行  提示
			return Ext.MessageBox.show({
				title:'提示',
				msg:'请选择一条数据',
				buttons:Ext.Msg.YES
			});
		}
		var _id = SelectedRow.data._id;
		var MyWindow=new Ext.Window({
				title:'人员管理',
				items:[{
					xtype:'form',
					width:'100%',
					bodyPadding:10,
					defaultType:'textfield',
					items:[{
						fieldLabel:'昵称',
						name:'name_id'
					},{
						fieldLabel:'姓名',
						name:'name'
					},{
						fieldLabel:'角色',
						name:'role'
					},{
						fieldLabel:'部门',        
						name:'department'
					},{
						fieldLabel:'密码',
						name:'password'
					},{
						fieldLabel:'资料下载权限',
						name:'data_access'
					},{
						fieldLabel:'积分',
						name:'credit'
					},{
						fieldLabel:'邮箱',
						name:'email'
					},{
						fieldLabel:'通过',
						name:'pass'
						
					},{
						fieldLabel:'序列号',
						name:'_id',
						hidden:true
					}]
				}],
				buttons : [{
				        text : '确定',
				        handler:function(){
				        	var form = MyWindow.down('form').getForm()
				        	if (form.isValid()) {
				        		form.submit({
						            url : '/admin/edit?collection=personnel_info',
						            waitTitle : '提示',
						            params:{name_id:_id},
						            method : 'POST',
						            waitMsg : '正在更新,请稍候...',
							        success : function(response) {
							        	MyWindow.hide()
							        	Ext.Msg.alert("信息", "更新成功！", function() {
		                        					Ext.getCmp('personnel_info').store.load();
		                   				 });
							        },
							        failure : function(response) {
							            alert("更新失败")
		           					 }
						        });
				        	}
					 	}
				    }, {
				        text : '重置',
				        handler : function() {
				        	MyWindow.down('form').getForm().reset()
				        }
				    }, {
				        text : '取消',
				        handler : function() {
				        	MyWindow.down('form').getForm().reset()
				        	MyWindow.hide()
				        }
				    }]
		});
		MyWindow.down('form').getForm().loadRecord(SelectedRow)
		MyWindow.show()
	}//personnel_edit
})

