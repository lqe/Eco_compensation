Ext.define('ECBM.view.PapersManager.research_report',{
	extend:'Ext.grid.Panel',
	alias:'widget.research_report',
	//可以传递参数_cfg 用于配置此对象 第一步
	constructor: function(_cfg){
		config={
			selType: 'checkboxmodel',
			store:'PapersManager.research_report_Store',
			columns:[
					{header : '序号',		xtype:'rownumberer',width:30},
					{header : '作者',		dataIndex:'author',	flex:1},
					{header : '标题',		dataIndex:'title',	flex:1}, 
					{header : '分值',		dataIndex:'value',	flex:1}, 
					{header : '简介',		dataIndex:'brief_content',flex:1}, 
					{header : '添加日期',	dataIndex:'date',flex:1	}, 
					{header : '操作', 		xtype:'actioncolumn', width:50,items:[{
																			iconCls : "icon-bullet_edit",
																			tooltip:'编辑',
																			handler:this.editFn
																		},{
																			iconCls : "icon-delete",
																			tooltip:'删除',
																			handler:this.deleteFn
																		}]},
					{header : 'href', 		dataIndex : 'href',hidden:true },
					{header : '序列号', 		dataIndex : '_id',hidden:true }
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
					handler:this.papers_research_add
				},'->',{
                width: 200,
                fieldLabel: '搜索',
                labelWidth: 50,
                xtype: 'searchfield',
                store: 'PapersManager.research_report_Store'
            }],
		this.bbar=[{
			xtype:'pagingtoolbar',
			store:'PapersManager.research_report_Store',		
			displayInfo:true,
	        displayMsg : '显示第{0}条数据到{1}条数据,一共有{2}条',
	        emptyMsg : "无数据"
		}],
		
		this.callParent(arguments);
	},  
	papers_research_add:function(){
		var MyWindow = new Ext.Window(
			{
		        closeAction : 'hide',
		        title : '上传资料文件',
		        autoDestroy : true,
		        buttonAlign : 'center',
		        buttons : [{
		            text : '确定',
		            handler : function() {
		            	var form=MyWindow.down('form')
		                if (form.getForm().isValid()) {
		                    form.getForm().submit({
		                        url : '/admin/add?collection=papers_manager&&category=research_report',
		                        waitTitle : '提示',
		                        method : 'POST',
		                        waitMsg : '正在添加数据验证,请稍候...',
		                        success : function(form, action) {
		                            MyWindow.hide();
		                            Ext.getCmp('research_report').store.reload()
		                        },
		                        failure : function(form,action) { 
		                        	MyWindow.hide();
		                            Ext.MessageBox.alert("警告",'数据导入失败');
		                        }
		                    });
		                }
		            }
		        }, {
		            text : '重置',
		            handler : function() {
		                form.getForm().reset();
		            }
		        }, {
		            text : '取消',
		            handler : function() {
		                MyWindow.hide();
		                form.getForm().reset();
		            }
		        }],
		        items : [{	
		        	xtype:'form',
			        frame : true,
			        bodyStyle : 'padding:5px 5px 0',
			        fileUpload : true,
			        items : [{
			        	xtype:'textfield',
			        	fieldLabel:'作者',
						name:'author'
			        },{
			        	xtype:'textfield',
			        	fieldLabel:'标题',
						name:'title'
			        },{
			        	xtype:'textfield',
			        	fieldLabel:'分值',
						name:'value'
			        }, {
			        	xtype:'datefield',
			        	fieldLabel:'日期',
			        	format : 'Y-m-d',
					    value:Ext.Date.format(new Date(),'Y-m-d'), 
						name:'date'
			        },{
			            fieldLabel:'资料文件',
			            xtype : 'fileuploadfield',
			            allowBlank:false,
			            //regex:/^.*\.(?:xls|xlsx)$/,
			            //regexText:'请选择文件',
			            emptyText : '请选择要文件...',
			            width:500,
			            name : 'myfile'
				     },{
			        	xtype:'textareafield',
			        	fieldLabel:'简介说明',
						name:'brief_content',
						grow:true,
						growMin:60,
						growMax:300,
						width:500
			        }]
				}]
		    }).show();

		
	},

	editFn:function(grid,rowIndex,colIndex){
		if(typeof(editWin)=='undefined'){var editWin}
		var rec= grid.getStore().getAt(rowIndex)
		if(editWin){
			var formFields=editWin.items.get(0).items;
			formFields.get(0).setValue(rec.get('title'))
			formFields.get(1).setValue(rec.get('author'))
			formFields.get(2).setValue(rec.get('value'))
			formFields.get(3).setValue(rec.get('date'))
			formFields.get(4).setValue(rec.get('href'))
			formFields.get(5).setValue(rec.get('brief_content'))
			formFields.get(5).setValue(rec.get('_id'))
			
		}else{
			editWin=Ext.create('Ext.window.Window',{
				title:'资料编辑',
				items:[{
					xtype:'form',
					width:'100%',
					bodyPadding:10,
					defaultType:'textfield',
					items:[{
						fieldLabel:'标题',
						name:'title',
						value:rec.get('title')
					},{
						fieldLabel:'作者',
						name:'author',
						value:rec.get('author')
					},{
						fieldLabel:'分值',
						name:'value',
						value:rec.get('value')
					},{
			        	xtype:'datefield',
			        	fieldLabel:'日期',
					    value:rec.get('date'),
						name:'date'
			        },{
						fieldLabel:'文件位置',
						name:'href',
						readOnly:true,
						value:rec.get('href')
					},{
			        	xtype:'textareafield',
			        	fieldLabel:'简介说明',
						name:'brief_content',
						grow:true,
						growMin:60,
						growMax:300,
						width:500,
						value:rec.get('brief_content')
			        },{
						fieldLabel:'_id',
						name:'_id',
						readOnly:true,
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
								url:'/admin/edit?collection=papers_manager&&category=research_report',
								success:function(form,action){
									editWin.hide()
									Ext.getCmp('research_report').store.reload();
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
	
	deleteFn:function(grid,rowIndex,colIndex){
		if(confirm("确认删除","您是否真的想删除该记录")){
			var rec= grid.getStore().getAt(rowIndex)
			Ext.Ajax.request({
				url:'/admin/del?collection=papers_manager',
				method:'POST',
				params:{_id:rec.get("_id"),
						href:rec.get("href")},
				waitMsg : '正在发布,请稍候...',
		        success : function(response) {
		        	var json = response.responseText
		        	var dict=Ext.JSON.decode(json)
		        	Ext.getCmp('research_report').store.load();
		        	
		        },
		        failure : function(response) {
		            alert("元数据获取失败")
		            }
	    });	
		}
	}

})


