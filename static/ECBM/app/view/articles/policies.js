Ext.define('ECBM.view.articles.policies',{
	extend:'Ext.grid.Panel',
	alias:'widget.policies',
	//可以传递参数_cfg 用于配置此对象 第一步
	constructor: function(_cfg){
		config={
			id:'policy',
			store:'articles.policles_Store',
			columns:[
					{text: '序号',		xtype:'rownumberer',width:30},
					{text: '作者',		dataIndex:'author',	flex:1},
					{text: '标题',		dataIndex:'title',	flex:2}, 
					{text: '内容',		dataIndex:'content',hidden:true,flex:3	}, 
					{text: '添加日期',	dataIndex:'date',flex:1	}, 
					{text: '序列号', 	dataIndex : '_id',hidden:true,flex:1 }
				],
			plugins:[{
           	 	ptype: 'rowexpander',
            	rowBodyTpl : new Ext.Template(
            		'<p><b>标题:</b> {title}</p>',
            		'<p><b>作者:</b> {author}</p>',
            		'<p><b>时间:</b> {date:this.formatChange}</p>',
               		'<p><b>内容</b><br/>{content}</p><br>',
                	{
                		formatChange: function(v){
                			var color='red'
                    		return '<span style="color: ' + color + ';">' + v+ '</span>';
                		}
                	}
            	)
        	}]
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
					handler:this.policies_add
				}, '-', {
				    xtype : 'button',
				    text : '删除',
				    iconCls : "icon-delete",
				    handler:this.policies_del
				}, '-', {
				    xtype : 'button',
				    text : '修改',
				    iconCls : "icon-user_edit",
				    handler:this.policies_edit
			 	}]
		// 页面切换按钮
		this.bbar=[{
			xtype:'pagingtoolbar',
			store:'articles.policles_Store',		
			displayInfo:true,
	        displayMsg : '显示第{0}条数据到{1}条数据,一共有{2}条',
	        emptyMsg : "无数据"
		}]
		this.callParent(arguments);
	},
	policies_add:function(){
	    var MyWindow=new Ext.Window({
				title:'政策法规',
				layout : 'fit',
				width:700,
				height:400,
			    closeAction : 'hide',
			    buttonAlign : 'center',
			    items:[{	   
					xtype:'form',
			    	layout : 'border',
					bodyStyle: 'background:#ffc; padding:10px;',
					frame:true,
				    items : [{
				    	region:'north',
				    	height:100,
				    	frame:true,
				    	layout:'anchor',
				    	defaults:{
				    		allowBlank:false,
				    		anchor:'40% 33%'
				    	},
				    	items:[{
					    		xtype : 'textfield',
					      		fieldLabel : '标题',
						        name : 'title'
					        },{
					        	xtype : 'textfield',
						        fieldLabel : '作者',
						        name : 'author'
					        },{
					            xtype : 'datefield',
					            fieldLabel : '添加时间',
					            format : 'Y-m-d',
					            value:Ext.Date.format(new Date(),'Y-m-d'), 
					            name : 'date'
					        }]
				    },{
				    	region:'center',
						xtype:'MyHtmlEditor',
						url:'/upload?filedir=policiesPic',
						anchor:'100% 80%',
						name:'content',
				        anchor:'100% 70%'
						
					}]
				}],
				buttons : [{
				        text : '确定',
				        handler:function(){
				        	var form = MyWindow.down('form').getForm()
				        	if (form.isValid()) {
				        		form.submit({
						            url : '/admin/add',
						            waitTitle : '提示',
						            params:{category:"policies"},
						            method : 'POST',
						            waitMsg : '正在发布,请稍候...',
							        success : function(response) {
							        	MyWindow.hide()
							        	Ext.Msg.alert("信息", "发布成功！", function() {
		                        					Ext.getCmp('policy').store.load();
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
	},//policies_add
	
	policies_del:function(view){
		var form=view.up('policies')
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
	                url : "/admin/del",
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
	},//policies_del
		
	policies_edit:function(view){
		var formpanel=view.up('policies')
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
				title:'政策法规',
				layout : 'fit',
				width:700,
				height:400,
			    closeAction : 'hide',
			    buttonAlign : 'center',
			    items:[{	   
					xtype:'form',
			    	layout : 'border',
					bodyStyle: 'background:#ffc; padding:10px;',
					frame:true,
				    items : [{
				    	region:'north',
				    	height:100,
				    	frame:true,
				    	layout:'anchor',
				    	defaults:{
				    		allowBlank:false,
				    		anchor:'40% 33%'
				    	},
				    	items:[{
					    		xtype : 'textfield',
					      		fieldLabel : '标题',
						        name : 'title'
					        },{
					        	xtype : 'textfield',
						        fieldLabel : '作者',
						        name : 'author'
					        },{
					            xtype : 'datefield',
					            fieldLabel : '添加时间',
					            format : 'Y-m-d',
					            value:Ext.Date.format(new Date(),'Y-m-d'), 
					            name : 'date'
					        }]
				    },{
				    	region:'center',
						xtype:'MyHtmlEditor',
						anchor:'100% 80%',
						name:'content',
				        anchor:'100% 70%'
						
					}]
				}],
				buttons : [{
				        text : '确定',
				        handler:function(){
				        	var form = MyWindow.down('form').getForm()
				        	if (form.isValid()) {
				        		form.submit({
						            url : '/admin/edit',
						            waitTitle : '提示',
						            params:{category:"policies",
						            		_id:_id
						            		},
						            method : 'POST',
						            waitMsg : '正在更新,请稍候...',
							        success : function(response) {
							        	MyWindow.hide()
							        	Ext.Msg.alert("信息", "更新成功！", function() {
		                        					Ext.getCmp('policy').store.load();
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
	}//policies_edit
})

