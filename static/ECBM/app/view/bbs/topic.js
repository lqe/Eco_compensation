Ext.define('topicModel',{
	extend:'Ext.data.Model',
	fields:[
		{name:'TId',		type:'string'},
		{name:'TUid',		type:'string'}, 
		{name:'TTitle',		type:'string'}, 
		{name:'TTime',		type:'string'}, 
		{name:'TContents',	type:'string'},
		{name:'TClickCount',type:'int'},
		{name:'TRecommend',	type:'boolean'},
		{name:'TFlag',		type:'string'},
		{name:'TScore',		type:'int'}
	]
})
var topicStore=Ext.create('Ext.data.Store',{
	model:'topicModel',
	proxy:{
		type:'ajax',
		url:'/bbs/topic/get',
		reader:{
			type:'json',
			root:'data',
			totalProperty:'total',
			SName:'SName'
		}
	}
});
/* border布局的面板*/
Ext.define('ECBM.view.bbs.topic',{
	extend:'Ext.grid.Panel',
	alias:'widget.topic',
	id:'topicID',
	GName:null,
	store:topicStore,
	columns:[
				{text: '序号',			xtype:'rownumberer',width:50},
				{text: '顶置', 			dataIndex:'TRecommend',width:50, xtype:'booleancolumn',
					trueText:'顶置+',falseText:'下沉-'},
				{text: '发帖人',			dataIndex:'TUid', flex:1,
					renderer:function(val){
							return "<span style='color:green;'>"+val+"</span>"
						}}, 
				{text: '主贴标题',		dataIndex:'TTitle',flex:3}, 
				{text: '发帖时间',		dataIndex:'TTime',flex:2}, 
				{text: '发帖内容', 		dataIndex:'TContents',hidden:true},
				{text: '点击次数', 		dataIndex:'TClickCount',hidden:true},
				{text: '标签', 			dataIndex:'TFlag',hidden:true},
				{text: '结贴分数', 		dataIndex:'TScore',hidden:true},
				{text: '主帖编号',		dataIndex:'TId'	,hidden:true}
			],
	plugins:[{
           	 	ptype: 'rowexpander',
            	rowBodyTpl : new Ext.Template(
            		'<p><b>发帖人:</b> {TUid}</p>',
            		'<p><b>发帖时间:</b> {TTime}</p>',
            		'<p><b>帖子标题:</b> {TTitle:this.formatChange}</p>',
               		'<p><b>帖子内容</b><br><div style=" padding:6px;border:1px solid #000">{TContents}</div></p>',
               		'<p><b>点击次数</b><br>{TClickCount}</p>',
               		'<p><b>结贴分数</b><br>{TScore}</p>',
               		'<p><b>标签</b><br/>{TFlag}</p>',
                	{
                		formatChange: function(v){
                			var color='red'
                    		return '<span style="color: ' + color + ';">' + v+ '</span>';
                		}
                	}
            	)
        	}],
//初始化组件   第二步
	initComponent:function(){
		this.tbar=[ {
				    xtype : 'button',
				    text : '删除',
				    iconCls : "icon-delete",
				    handler:this.del,
				    scope:this
				}, '-', {
				    xtype : 'button',
				    text : '置顶或取消',
				    iconCls : "icon-user_edit",
				    handler:this.reccomend,
				    scope:this
			 	}]
		// 页面切换按钮
		this.bbar=[{
			xtype:'pagingtoolbar',
			store:topicStore,		
			displayInfo:true,
	        displayMsg : '显示第{0}条数据到{1}条数据,一共有{2}条',
	        emptyMsg : "无数据"
		}]
		this.callParent(arguments);
	},
	getSelectedData:function(){
		var form=this
		var SelectedRow=form.getSelectionModel().selected.items[0]  			//获取选中的行的容器
		if (!SelectedRow){															//没选中行  提示
			Ext.MessageBox.show({
				title:'提示',
				msg:'请选择一条数据',
				buttons:Ext.Msg.YES
			});
			return null
		}
		return SelectedRow.data
	},
	del:function(view){
		var me=this;
		var data=me.getSelectedData();
		if (data==null) return;
		var SName=me.store.proxy.reader.rawData.SName;
		//var rowIndex=SelectedRow.index
		//ActivePanel.getSelectionModel().selectRow(rowIndex);
		Ext.Msg.confirm("提示", "您确定要删除这些信息吗?", function(btn, text) {		//确认删除
       	 	if (btn == 'yes') {
            	Ext.Ajax.request({
	                url : "/bbs/topic/del",
	                params : {TId : data.TId},
	                method : "POST",
					waitMsg : '正在删除,请稍候...',
			        success : function(response) {
			        	var json = response.responseText
			        	var dict=Ext.JSON.decode(json)
			        	alert(dict["msg"])
			        	me.store.load({
			        		params:{SName:SName}
			        	});
			        },
			        failure : function(response) {
			            alert("发送失败");
			         }
	            });
      	  }
	   });
	},//topic_del
	reccomend:function(){
		var me=this;
		var data=me.getSelectedData();
		if (data==null) return;
		var SName=this.store.proxy.reader.rawData.SName;
		var TRecommend=data.TRecommend;
		Ext.Ajax.request({
			url:'/bbs/topic/edit',
			method:'POST',
			params:{
				TId:data.TId,
				TRecommend:TRecommend ? false : true
			},
			success:function(response){
				alert(Ext.JSON.decode(response.responseText)['msg']);
				me.store.load({
					params:{
						SName:SName
					}
				});
			}
		});
	}
})

