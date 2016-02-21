var fsI_cfg={
    labelAlign : 'top',
    frame : true,
    bodyStyle : 'padding:5px 5px 0',
    width : 600,
    xtype : 'form',
    items : [{
		layout : 'column',
		items : [{
            columnWidth : .5,
            layout : 'form',
            items : [{
                xtype : 'textfield',
                fieldLabel : '会议主题',
                name : 'title',
                allowBlank : false,
                anchor : '95%'
            }, {
                xtype : 'textfield',
                fieldLabel : '会议主办方单位',
                name : 'holder',
                allowBlank : false,
                anchor : '95%'
            },{
                xtype : 'textfield',
                fieldLabel : '会议主办城市',
                name : 'city',
                allowBlank : false,
                anchor : '95%'
            }, {
                xtype : 'textfield',
                fieldLabel : '会议详细地址',
                name : 'addr',
                allowBlank : false,
                anchor : '95%'
            },{
                xtype : 'datefield',
                fieldLabel : '会议开始时间',
                format : 'Y-m-d H:i:s',
                name : 'start',
                allowBlank : false,
                anchor : '95%'
            }, {
                xtype : 'datefield',
                fieldLabel : '会议截止时间',
                format : 'Y-m-d H:i:s',
                name : 'deadline',
                allowBlank : false,
                anchor : '95%'
            },{
                xtype : 'textfield',
                fieldLabel : '举办周期',
                name : 'cyc',
                allowBlank : false,
                anchor : '95%'
            }]
        }, {
            columnWidth : .5,
            layout : 'form',
            items : [{
                xtype : 'textfield',
                fieldLabel : '信息发布者',
                name : 'editor',
                allowBlank : false,
                anchor : '95%'
            },{
                xtype : 'datefield',
                fieldLabel : '发布时间',
                format : 'Y-m-d H:i:s',
                value:Ext.Date.format(new Date(),'Y-m-d H:i:s'),
                name : 'date',
                allowBlank : false,
                anchor : '95%'
            },  {
                xtype : 'textfield',
                fieldLabel : '联系人',
                name : 'linkman',
                allowBlank : false,
                anchor : '95%'
            },{
                xtype : 'textfield',
                fieldLabel : '联系电话',
                name : 'phone',
                allowBlank : false,
                anchor : '95%'
            }, {
                xtype : 'hidden',
                name : 'category',
                value : 'baseInfor',
                anchor : '95%'
            },{
                xtype : 'hidden',
                name : '_id',
                value : '0000',
                anchor : '95%'
            }]
        }]
    }, {
        xtype : 'MyHtmlEditor',
        name : 'content',
        height : 200,
        anchor : '98%'
    }]
}

var fsI = new Ext.form.FormPanel(fsI_cfg);

var fsI1 = new Ext.form.FormPanel(fsI_cfg);

var MyWIndowI = new Ext.Window({
    closeAction : 'hide',
    title : '会议介绍',
    pageX : 220,
    pageY : 70,
    width:600,
    autoDestroy : true,
    buttonAlign : 'center',
    buttons : [{
        text : '确定',
        handler : function() {// 当点击按钮执行这个函数
            if (fsI.getForm().isValid()) {
                fsI.getForm().submit({
                    url : '/meeting/add/baseIfor',
                    waitTitle : '提示',
                    method : 'POST',
                    waitMsg : '正在添加数据验证,请稍候...',
                    success : function() {
				        	MyWIndowI.hide();
				        	Ext.getCmp('meeting_dynamic_store').store.reload();
					},
					failure: function(form, action) {                                          
                                        Ext.MessageBox.alert('提示', action.result.msg);  
                                        return;  
                                    }
                });
            }
        }
    }, {
        text : '重置',
        handler : function() {
            fsI.getForm().reset();
        }
    }, {
        text : '取消',
        handler : function() {
            MyWIndowI.hide();
            fsI.getForm().reset();
        }
    }],
    items : [fsI]
});

var MyWIndowI1 = new Ext.Window({
    closeAction : 'hide',
    title : '会议介绍',
    pageX : 220,
    pageY : 70,
    width:600,
    autoDestroy : true,
    buttonAlign : 'center',
    buttons : [{
        text : '确定',
        handler : function() {// 当点击按钮执行这个函数
            if (fsI1.getForm().isValid()) {
                fsI1.getForm().submit({
                    url : '/meeting/update/baseIfor',
                    waitTitle : '提示',
                    method : 'POST',
                    waitMsg : '正在添加数据验证,请稍候...',
                    success : function() {
				        	MyWIndowI1.hide();
				        	Ext.getCmp('meeting_dynamic').store.load()
					},
					failure: function(form, action) {                                          
                            Ext.MessageBox.alert('提示', action.result.msg);  
                            return;  
                    }
                });
            }
        }
    }, {
        text : '重置',
        handler : function() {
            fsI1.getForm().reset();
        }
    }, {
        text : '取消',
        handler : function() {
            MyWIndowI1.hide();
            fsI1.getForm().reset();
        }
    }],
    items : [fsI1]
});    

var fsM = new Ext.form.FormPanel({
    labelAlign : 'top',
    frame : true,
    bodyStyle : 'padding:5px 5px 0',
    width : 600,
    xtype : 'form',
    items : [{
        layout : 'column',
        items : [{
            columnWidth : .5,
            layout : 'form',
            items : [{
                xtype : 'textfield',
                fieldLabel : '公司名称',
                name : 'company_name',
                anchor : '95%'
            }, {
                xtype : 'textfield',
                fieldLabel : '参会者姓名',
                name : 'company_linkman',
                anchor : '95%'
            }, {
                xtype : 'textfield',
                fieldLabel : '手机',
                name : 'company_mobile',
                anchor : '95%'
            }, {
                xtype : 'textfield',
                fieldLabel : '性别',
                name : 'company_sex',
                anchor : '95%'
            }, {
                xtype : 'textfield',
                fieldLabel : '传真',
                name : 'company_fax',
                anchor : '95%'
            }, {
                xtype : 'textfield',
                fieldLabel : '邮箱',
                name : 'company_email',
                anchor : '95%'
            }]
        }, {
            columnWidth : .5,
            layout : 'form',
            items : [{
                xtype : 'textfield',
                fieldLabel : '公司所在省份',
                name : 'company_province',
                anchor : '95%'
            }, {
                xtype : 'textfield',
                fieldLabel : '公司所在城市',
                name : 'company_city',
                anchor : '95%'
            }, {
                xtype : 'textfield',
                fieldLabel : '公司地址',
                name : 'company_address',
                anchor : '95%'
            }, {
                xtype : 'textfield',
                fieldLabel : '邮编',
                name : 'company_zip',
                anchor : '95%'
            }, {
                xtype : 'textfield',
                fieldLabel : '公司主页',
                name : 'company_homepage',
                anchor : '95%'
            },{
                xtype : 'textfield',
                fieldLabel : '参会者QQ',
                name : 'company_qq',
                anchor : '95%'
            },{
                xtype : 'textfield',
                fieldLabel : '职务',
                name : 'company_job',
                anchor : '95%'
            },{
                xtype : 'hidden',
                fieldLabel : 'meetingid',
                name : 'meetingid',
                anchor : '95%'
            },{
                xtype : 'hidden',
                fieldLabel : 'Submit_1',
                name : 'Submit_1',
                anchor : '95%'
            }, {
                xtype : 'hidden',
                name : 'category',
                value : 'meeting',
                anchor : '95%'
            }]
        }]
    }, {
        xtype : 'MyHtmlEditor',
        name : 'detail',
        fieldLabel : '与会要求',
        height : 200,
        anchor : '98%'
    }]
});

Ext.define('ECBM.view.articles.meeting_dynamic',{
	extend:'Ext.grid.Panel',
	alias:'widget.meeting_dynamic',
	//可以传递参数_cfg 用于配置此对象 第一步
	constructor: function(_cfg){
		config={
			//id:'meeting_dynamic',
			store:'articles.meeting_dynamic_Store',
			columns : [
		        new Ext.grid.RowNumberer(), 
		        {header : '会议标题',dataIndex : 'title',flex:2},
				{header : '发布日期',dataIndex : 'date',flex:1},
				{header : '作者',dataIndex : 'editor',flex:1},
				{header : '序列号',hidden : true,dataIndex : '_id'}
				],
	        viewConfig : {
	            forceFit : true
	        },
	        loadMask : {
	            msg : '数据加载中，请稍后 '
	        }
		}
		Ext.apply(this, _cfg,config);
		this.superclass.constructor.call(this);
	},
	//初始化组件   第二步
	initComponent:function(){
		 this.tbar=[{
	            xtype : 'button',
	            text : '添加',
	            iconCls : "icon-add",
	            handler : this.addItem
	        }, '-', {
	            xtype : 'button',
	            text : '删除',
	            iconCls : "icon-delete",
	            handler : this.deleteItem
	        }, '-', {
	            xtype : 'button',
	            text : '修改',
	            iconCls : "icon-user_edit",
	            handler : this.modifyItem
	        },'-', {
	            xtype : 'button',
	            text : '查看回执',
	            iconCls : "icon-book_open",
	            handler : this.scanItem
	        }]
		// 页面切换按钮
		this.bbar=[{
			xtype:'pagingtoolbar',
			store:'articles.meeting_dynamic_Store',		
			displayInfo:true,
	        displayMsg : '显示第{0}条数据到{1}条数据,一共有{2}条',
	        emptyMsg : "无数据"
		}]
		this.callParent(arguments);
	},
	addItem:function(){
		fsI.getForm().reset();
        MyWIndowI.show();
	},
	deleteItem:function(view){
		var form=view.up('meeting_dynamic')
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
	                url : "/meeting/del/baseIfor",
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
	},
	modifyItem:function(view){
		var formpanel=view.up('meeting_dynamic')
		var SelectedRow=formpanel.getSelectionModel().selected.items[0]  			//获取选中的行的容器
		if (!SelectedRow){															//没选中行  提示
			return Ext.MessageBox.show({
				title:'提示',
				msg:'请选择一条数据',
				buttons:Ext.Msg.YES
			});
		}
		var _id = SelectedRow.data._id;
        fsI1.getForm().loadRecord(SelectedRow);
        MyWIndowI1.show();
	},
	scanItem:function(view){
		var formpanel=view.up('meeting_dynamic')
		var SelectedRow=formpanel.getSelectionModel().selected.items[0]  			//获取选中的行的容器
		if (!SelectedRow){															//没选中行  提示
			return Ext.MessageBox.show({
				title:'提示',
				msg:'请选择一条数据',
				buttons:Ext.Msg.YES
			});
		}
		
		var _id = SelectedRow.data._id;	//获取选中行的id
		var Main=Ext.getCmp('MainPanel') //面板
		////////////////////////////////////////////////////新面板的配置 id=_id
		Ext.define('mo', {
			extend: 'Ext.data.Model',
        	fields:[
		      	{name : "meetingID",type : "string"},
		      	{name : "p_name",type : "string" }, 
		        {name : "p_linkman",type : "string"}, 
		        {name : "p_mobile",type : "string"},
		        {name : "p_tel",type : "string"},
		        {name : "p_fax",type : "string"},
		        {name : "p_email",type : "string"},
		        {name : "p_sex",type : "string"},
		        {name : "p_province",type : "string"},
		        {name : "p_city",type : "string"}, 
		        {name : "p_addr",type : "string"},
		        {name : "p_zip",type : "string"}, 
		        {name : "p_homepage",type : "string"},
		        {name : "p_qq",type : "string"},
		        {name : "p_job", type : "string"},
		        {name : "P_detail", type : "string"},
		        {name : "_id",type : "string"}
      		]
    	});
      	var ds1=Ext.create(Ext.data.Store,{
      			pageSize: 20,
				model:'mo',
				proxy:new Ext.data.HttpProxy({
						method : 'GET',
				        url : '/meeting/get/participants?_id=' + _id,
						reader:{
							type:'json',
							root:'data',
							totalProperty:'total'
							}
				})    
		})
		var pagingBar1 = new Ext.PagingToolbar({
                  pageSize : 20,
                  store : ds1,
                  displayInfo : true,
                  displayMsg : '显示第{0}条到{1}条记录，一共{2}条',
                  emptyMsg : "没有记录"
        });
		var myexport=function(){
			document.location.href='/meeting/export?_id='+_id
		}
		var deletehumItem=function(view){
			var form=Ext.getCmp('participants')
			var SelectedRow=form.getSelectionModel().selected.items[0]  				//获取选中的行的容器
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
		                url : "/meeting/del/participants",
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
			
		}
	   	var modifydetailItem=function() {
	       var record = grid1.getSelectionModel().getSelected();
	       if (record != null) {
	           fsM.getForm().loadRecord(record);
	           MyWIndowM.show();
	           var uid = '';
		       uid = record.data._id;
		   } else {
		       Ext.Msg.alert('提示', '请选择一条数据');
		       }
	   	}
		var backItem=function(){
			Main.remove('participants')  			//删除原有的
			cfg={
				xtype:'meeting_dynamic',
				id :'meeting_dynamic',
				title:'会议动态',	
				layout:'fit',
				closable:true
			};
			tab = Main.add(cfg)
			Main.setActiveTab('meeting_dynamic');
		}
		var grid1 = Ext.create( Ext.grid.Panel,{
				   id:'participants',
				   title:'记录',
				   closable:true,
                   columns : [
				        new Ext.grid.RowNumberer(),
						{header : '公司名称',dataIndex : 'p_name',flex:2}, 
			            {header : '联系人',dataIndex : 'p_linkman',flex:2},
			            {header : '性别',dataIndex : 'p_sex',flex:2},
			            {header : '职务',dataIndex : 'p_job',flex:2},
			            {header : '手机',dataIndex : 'p_mobile',flex:2},
			            {header : 'QQ',dataIndex : 'p_qq',flex:2},
			            {header : '序列号', hidden : true,dataIndex : '_id'}
					],
                   store : ds1,
                   bbar : pagingBar1,
                   viewConfig : {
                       forceFit : true
                   },
                   loadMask : {
                       msg : '数据加载中，请稍后 '
                   },
                   tbar : [{
                       xtype : 'button',
                       text : '导出为excel',
                       iconCls : "icon-table_go",
                       handler : myexport
                   }, '-', {
                       xtype : 'button',
                       text : '删除',
                       iconCls : "icon-delete",
                       handler : deletehumItem
                   }, '-',{
                       xtype : 'button',
                       text : '返回',
                       iconCls : "icon-arrow_undo",
                       handler : backItem
                   }]
               });
		
		Main.remove('meeting_dynamic')  			//删除原有的        
		ds1.load();
		Main.add(grid1);
		Main.setActiveTab('participants');
	}
	
})


/*
 * var proxy = new Ext.data.HttpProxy({
	        method : 'GET',
	        url : '/manager/load/?name=meeting'
    	});
	    var recordType = new Ext.data.Record.create([
	    	{name : "content", type : "string"},
	    	{name : "title",type : "string"},
	    	{name : "data",type : "string"},
	    	{name : "editor",type : "string"},
	    	{name : "holder",type : "string"},
	    	{name : "city",type : "string"}, 
	    	{name : "cyc",type : "string"},
	    	{name : "addr",type : "string"},
	    	{name : "deadline",type : "string"},
	    	{name : "hum",type : "string"},
	    	{name : "phone",type : "string"},
	    	{name : "start",type : "string"},
	    	{name : "_id",type : "string"}
	    ]);
		var recordType1 = new Ext.data.Record.create([
	      	{name : "detail",type : "string"},
	      	{name : "company_name",type : "string" }, 
	        {name : "company_linkman",type : "string"}, 
	        {name : "company_mobile",type : "string"},
	        {name : "company_tel",type : "string"},
	        {name : "company_fax",type : "string"},
	        {name : "company_email",type : "string"},
	        {name : "company_sex",type : "string"},
	        {name : "company_province",type : "string"},
	        {name : "company_city",type : "string"}, 
	        {name : "company_address",type : "string"},
	        {name : "company_zip",type : "string"}, 
	        {name : "company_homepage",type : "string"},
	        {name : "company_qq",type : "string"},
	        {name : "company_job", type : "string"},
	        {name : "meetingid", type : "string"},
	        {name : "_id",type : "string"},
	        {name : "Submit_1", type : "string"}
      	]);
      	var reader = new Ext.data.JsonReader({
	        totalProperty : "results",
	        root : "rows",
	        id : "_id"
    		}, recordType);
    
	   var reader1 = new Ext.data.JsonReader({
	        totalProperty : "results",
	        root : "rows",
	        id : "_id"
	    }, recordType1);
	    var ds = new Ext.data.Store({
	        proxy : proxy,
	        reader : reader
   	 	});
    	var cm = new Ext.grid.ColumnModel({
	        defaultSortable : true,
	        columns : [
		        new Ext.grid.RowNumberer(), 
		        {header : '会议标题',dataIndex : 'title'},
				{header : '发布日期',dataIndex : 'data'},
				{header : '作者',dataIndex : 'editor'},
				{header : '序列号',hidden : true,dataIndex : '_id'}
				]
	    });
	   /* var cm1 = new Ext.grid.ColumnModel({
	        defaultSortable : true,
	        columns : [
				new Ext.grid.RowNumberer(),
				{header : '公司名称',dataIndex : 'company_name'}, 
	            { header : '联系人',dataIndex : 'company_linkman'},
	            {header : '职务',dataIndex : 'company_job'},
	            {header : '序列号', hidden : true,dataIndex : '_id'}
	            ]
	    });
	    var pagingBar = new Ext.PagingToolbar({
	        pageSize : 20,
	        store : ds,
	        displayInfo : true,
	        displayMsg : '显示第{0}条到{1}条记录，一共{2}条',
	        emptyMsg : "没有记录"
	    });
 
Morik.Office.DocmeetingPanel = function(config) {
	Morik.Office.DocmeetingPanel.superclass.constructor.call(this, config);
	
    
    function addItem() {
        fsI.getForm().reset();
        MyWIndowI.show();
        ds.reload();
    }

    function modifyItem() {
        var record = gri.getSelectionModel().getSelected();
        if (record != null) {
            fsI1.getForm().loadRecord(record);
            MyWIndowI1.show();
            var uid = '';
            uid = record.data._id;
        } else {
            Ext.Msg.alert('提示', '请选择一条数据');
        }
    }

    function deleteItem() {
        var record = gri.getSelectionModel().getSelected();
        if (record != null) {
            Ext.Msg.confirm("提示", "您确定要删除这些信息吗?", function(btn, text) {
                if (btn == 'yes') {
                    var uid = '';
                    uid = record.data._id;
                    Ext.Ajax.request({
                        url : "/manager/deletemeeting",
                        params : {
                            _id : uid
                        },
                        method : "POST",
                        success : function(response) {
                            Ext.Msg.alert("信息", "数据更新成功！", function() {
                               
                                ds.reload();
                               
                                
                            });
                        },
                        failure : function(response) {
                            Ext.Msg.alert("警告", "数据删除失败，请稍后再试！");
                        }
                    });
                }
            });
        } else {
            Ext.Msg.alert('提示', '请选择一条数据');
        }
    }

    function scanItem() {
        var record = gri.getSelectionModel().getSelected();
        if (record != null) {
              var uid = '';
              uid = record.data._id;
              var proxy1 = new Ext.data.HttpProxy({
                  method : 'GET',
                  url : '/manager/showmeeting/?_id='+uid
              });
              var ds1 = new Ext.data.Store({
                  proxy : proxy1,
                  reader : reader1
              });
                   
              that.ds1=ds1;
              var pagingBar1 = new Ext.PagingToolbar({
                  pageSize : 20,
                  store : ds1,
                  displayInfo : true,
                  displayMsg : '显示第{0}条到{1}条记录，一共{2}条',
                  emptyMsg : "没有记录"
               });
               var grid1 = new Ext.grid.GridPanel({
                   cm : cm1,
                   store : ds1,
                   stripeRows : true,
                   resizable : false,
                   frame : true,
                   bbar : pagingBar1,
                   viewConfig : {
                       forceFit : true
                   },
                   loadMask : {
                       msg : '数据加载中，请稍后 '
                   },
                   tbar : [{
                       xtype : 'button',
                       text : '导出为excel',
                       iconCls : "add-button",
                       handler : outItem
                   }, '-', {
                       xtype : 'button',
                       text : '删除',
                       iconCls : "delete-button",
                       handler : deletehumItem
                   }, '-', {
                       xtype : 'button',
                       text : '查看详细',
                       iconCls : "modify-button",
                       handler : modifydetailItem
                   }, '-', {
                       xtype : 'button',
                       text : '返回',
                       iconCls : "modify-button",
                       handler : backItem
                   }]
               });
                    
               function modifydetailItem() {
                   var record = grid1.getSelectionModel().getSelected();
                   if (record != null) {
                       fsM.getForm().loadRecord(record);
                       MyWIndowM.show();
                       var uid = '';
                       uid = record.data._id;
                   } else {
                       Ext.Msg.alert('提示', '请选择一条数据');
                   }
               }
                    
               function deletehumItem() {
                   var record = grid1.getSelectionModel().getSelected();
                   if (record != null) {
                       Ext.Msg.confirm("提示", "您确定要删除这些信息吗?", function(btn, text) {
                           if (btn == 'yes') {
                               var uid = '';
                               uid = record.data._id;
                               Ext.Ajax.request({
                                   url : "/manager/deletehum",
                                   params : {
                                    _id : uid
                                   },
                               method : "POST",
                               success : function(response) {
                                   Ext.Msg.alert("信息", "数据更新成功！", function() {
                               
                                       ds1.reload();
                                   });
                               },
                              failure : function(response) {
                                  Ext.Msg.alert("警告", "数据删除失败，请稍后再试！");
                              }
                                  });
                              }
                                });
                         } else {
                        Ext.Msg.alert('提示', '请选择一条数据');
                        }
                     }
                     
                    function outItem() {
                             var record = grid1.getSelectionModel().getSelected();
                             if (record != null) {
                                  var uid = '';
                                  uid = record.data.meetingid;
                            /*      Ext.Ajax.request({
                                       method : 'GET',
                                       url : 'manager/export/?_id='+uid
                                  });*/
  /*                             window.location.href = 'manager/export/?_id='+uid     
                         } else {
                        Ext.Msg.alert('提示', '请选择一条数据');
                        }
                     }
              
                    
                    function backItem(){
                    var proxy = new Ext.data.HttpProxy({
                        method : 'GET',
                        url : '/manager/load/?name=meeting'
                    });
                    var reader = new Ext.data.JsonReader({
                        totalProperty : "results",
                        root : "rows",
                        id : "_id"
                    }, recordType);
                    var ds = new Ext.data.Store({
                        proxy : proxy,
                        reader : reader
                    });
                    var pagingBar = new Ext.PagingToolbar({
                        pageSize : 20,
                        store : ds,
                        displayInfo : true,
                        displayMsg : '显示第{0}条到{1}条记录，一共{2}条',
                        emptyMsg : "没有记录"
                    });
                    var grid = new Ext.grid.GridPanel({
                        cm : cm,
                        store : ds,
                        stripeRows : true,
                        resizable : false,
                        frame : true,
                        bbar : pagingBar,
                        viewConfig : {
                        forceFit : true
                        },
                        loadMask : {
                             msg : '数据加载中，请稍后 '
                        },
                        tbar : [{
                             xtype : 'button',
                             text : '添加',
                             iconCls : "add-button",
                             handler : addItem
                        }, '-', {
                             xtype : 'button',
                             text : '删除',
                             iconCls : "delete-button",
                             handler : deleteItem
                        },'-', {
                             xtype : 'button',
                             text : '查看回执',
                             iconCls : "delete-button",
                             handler : scanItem
                        }, '-', {
                             xtype : 'button',
                             text : '修改',
                             iconCls : "modify-button",
                             handler : modifyItem
                        }]
                    });
                    
                    gri=grid;
                    that.remove(grid1);
                    that.ds = ds;
                    ds.reload();
                    that.add(grid);
                    that.doLayout(true);
                                  
                    }
                    
                    
                   var MyWIndowM = new Ext.Window({
                        closeAction : 'hide',
                        title : '会议人员详细信息',
                        pageX : 220,
                        pageY : 70,
                        width:600,
                        autoDestroy : true,           
                        items : [fsM]
                   });
                    
                  that.remove(gri);                                 
                  that.ds1 = ds1;
                  ds1.load();
                  that.add(grid1);
                  that.doLayout(true);
                    
                        }
                        else {
                            Ext.Msg.alert('提示', '请选择一条数据');
                          }
                        
    }
    
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var s = year + '-' + month + '-' + day;
    
     var fsI = new Ext.form.FormPanel({
        labelAlign : 'top',
        frame : true,
        bodyStyle : 'padding:5px 5px 0',
        width : 600,
        xtype : 'form',
        items : [{
            layout : 'column',
            items : [{
                columnWidth : .5,
                layout : 'form',
                items : [{
                    xtype : 'textfield',
                    fieldLabel : '会议主题',
                    name : 'title',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '作者',
                    name : 'editor',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '联系人',
                    name : 'hum',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '会议主办城市',
                    name : 'city',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '会议详细地址',
                    name : 'addr',
                    anchor : '95%'
                },]
            }, {
                columnWidth : .5,
                layout : 'form',
                items : [{
                    xtype : 'datefield',
                    fieldLabel : '发布时间',
                    format : 'Y-m-d',
                    emptyText : s,
                    name : 'data',
                    anchor : '95%'
                }, {
                    xtype : 'datefield',
                    fieldLabel : '会议开始时间',
                    format : 'Y-m-d',
                    emptyText : s,
                    name : 'star',
                    anchor : '95%'
                }, {
                    xtype : 'datefield',
                    fieldLabel : '会议截止时间',
                    format : 'Y-m-d',
                    emptyText : s,
                    name : 'deadline',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '联系电话',
                    name : 'phone',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '举办周期',
                    name : 'cyc',
                    anchor : '95%'
                }, {
                    xtype : 'hidden',
                    name : 'category',
                    value : 'meeting',
                    anchor : '95%'
                }]
            }]
        }, {
            xtype : 'CJ_starthtmleditor',
            name : 'content',
            fieldLabel : '会议简介',
            height : 200,
            anchor : '98%'
        }]
    });

     var fsI1 = new Ext.form.FormPanel({
        labelAlign : 'top',
        frame : true,
        bodyStyle : 'padding:5px 5px 0',
        width : 600,
        xtype : 'form',
        items : [{
            layout : 'column',
            items : [{
                columnWidth : .5,
                layout : 'form',
                items : [{
                    xtype : 'textfield',
                    fieldLabel : '会议主题',
                    name : 'title',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '作者',
                    name : 'editor',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '联系人',
                    name : 'hum',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '会议主办城市',
                    name : 'city',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '会议详细地址',
                    name : 'addr',
                    anchor : '95%'
                },]
            }, {
                columnWidth : .5,
                layout : 'form',
                items : [{
                    xtype : 'datefield',
                    fieldLabel : '发布时间',
                    format : 'Y-m-d',
                    emptyText : s,
                    name : 'data',
                    anchor : '95%'
                }, {
                    xtype : 'datefield',
                    fieldLabel : '会议开始时间',
                    format : 'Y-m-d',
                    emptyText : s,
                    name : 'star',
                    anchor : '95%'
                }, {
                    xtype : 'datefield',
                    fieldLabel : '会议截止时间',
                    format : 'Y-m-d',
                    emptyText : s,
                    name : 'deadline',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '联系电话',
                    name : 'phone',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '举办周期',
                    name : 'cyc',
                    anchor : '95%'
                }, {
                    xtype : 'hidden',
                    name : 'category',
                    value : 'meeting',
                    anchor : '95%'
                }]
            }]
        }, {
            xtype : 'CJ_starthtmleditor',
            name : 'content',
            fieldLabel : '会议简介',
            height : 200,
            anchor : '98%'
        }, {
            xtype : 'hidden',
            name : '_id',
            fieldLabel : '_id',
            height : 200,
            anchor : '98%'
        }]
    });
    
    var MyWIndowI = new Ext.Window({
        closeAction : 'hide',
        title : '会议介绍',
        pageX : 220,
        pageY : 70,
        width:600,
        autoDestroy : true,
        buttonAlign : 'center',
        buttons : [{
            text : '确定',
            handler : function() {// 当点击按钮执行这个函数
                if (fsI.getForm().isValid()) {
                    fsI.getForm().submit({
                        url : '/manager/add',
                        waitTitle : '提示',
                        method : 'POST',
                        waitMsg : '正在添加数据验证,请稍候...',
                        success : function() {
                            MyWIndowI.hide();
                            ds.reload();
                        },
                        failure : function(fsI, action) {
                            Ext.MessageBox.alert('提示', action.result.message);
                            fsI.getForm().reset();

                        }
                    });
                }
            }
        }, {
            text : '重置',
            handler : function() {
                fsI.getForm().reset();
            }
        }, {
            text : '取消',
            handler : function() {
                MyWIndowI.hide();
                fsI.getForm().reset();
            }
        }],
        items : [fsI]
    });

    var MyWIndowI1 = new Ext.Window({
        closeAction : 'hide',
        title : '会议介绍',
        pageX : 220,
        pageY : 70,
        width:600,
        autoDestroy : true,
        buttonAlign : 'center',
        buttons : [{
            text : '确定',
            handler : function() {// 当点击按钮执行这个函数
                if (fsI1.getForm().isValid()) {
                    fsI1.getForm().submit({
                        url : '/manager/updateMeeting',
                        waitTitle : '提示',
                        method : 'POST',
                        waitMsg : '正在添加数据验证,请稍候...',
                        success : function() {
                            MyWIndowI1.hide();
                            ds.reload();
                        },
                        failure : function(fsI, action) {
                            Ext.MessageBox.alert('提示', action.result.message);
                            fsI1.getForm().reset();

                        }
                    });
                }
            }
        }, {
            text : '重置',
            handler : function() {
                fsI1.getForm().reset();
            }
        }, {
            text : '取消',
            handler : function() {
                MyWIndowI1.hide();
                fsI1.getForm().reset();
            }
        }],
        items : [fsI1]
    });    
    var fsM = new Ext.form.FormPanel({
        labelAlign : 'top',
        frame : true,
        bodyStyle : 'padding:5px 5px 0',
        width : 600,
        xtype : 'form',
        items : [{
            layout : 'column',
            items : [{
                columnWidth : .5,
                layout : 'form',
                items : [{
                    xtype : 'textfield',
                    fieldLabel : '公司名称',
                    name : 'company_name',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '参会者姓名',
                    name : 'company_linkman',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '手机',
                    name : 'company_mobile',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '性别',
                    name : 'company_sex',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '传真',
                    name : 'company_fax',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '邮箱',
                    name : 'company_email',
                    anchor : '95%'
                },]
            }, {
                columnWidth : .5,
                layout : 'form',
                items : [{
                    xtype : 'textfield',
                    fieldLabel : '公司所在省份',
                    name : 'company_province',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '公司所在城市',
                    name : 'company_city',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '公司地址',
                    name : 'company_address',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '邮编',
                    name : 'company_zip',
                    anchor : '95%'
                }, {
                    xtype : 'textfield',
                    fieldLabel : '公司主页',
                    name : 'company_homepage',
                    anchor : '95%'
                },{
                    xtype : 'textfield',
                    fieldLabel : '参会者QQ',
                    name : 'company_qq',
                    anchor : '95%'
                },{
                    xtype : 'textfield',
                    fieldLabel : '职务',
                    name : 'company_job',
                    anchor : '95%'
                },{
                    xtype : 'hidden',
                    fieldLabel : 'meetingid',
                    name : 'meetingid',
                    anchor : '95%'
                },{
                    xtype : 'hidden',
                    fieldLabel : 'Submit_1',
                    name : 'Submit_1',
                    anchor : '95%'
                }, {
                    xtype : 'hidden',
                    name : 'category',
                    value : 'meeting',
                    anchor : '95%'
                }]
            }]
        }, {
            xtype : 'CJ_starthtmleditor',
            name : 'detail',
            fieldLabel : '与会要求',
            height : 200,
            anchor : '98%'
        }]
    });
     
    var gri=grid;
    var that = this ;
    ds.load();   
    that.add(grid);
    that.hide(grid);  
}
*/

