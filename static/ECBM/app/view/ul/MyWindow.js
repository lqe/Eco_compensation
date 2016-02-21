/*自定义的window*/
Ext.define('ECBM.view.ul.MyWindow',{
	extend:'Ext.window.Window',
	alias:'widget.MyWindow',
	url:null,						//保存数据的 url
	params:null,					//表单外的参数
	refreshXtype:null,				//保存数据后 刷新的组件的xtype
	refreshID:null,					//保存数据后 刷新的组件id
	frame:true,
	closable:false,
	layout : 'fit',
	constructor: function(_cfg){
		Ext.apply(this,_cfg,
		{	items:[{
				xtype:'form',
				width:'100%',
				frame:true,
				bodyStyle: 'background:#ffc; padding:20px;',
				defaultType:'textfield',
				defaults:{
					allowBlank:false
				},
				items:_cfg.formItems||[]
			}],
			dockedItems:[{
				xtype:'toolbar',
				dock:'bottom',
				items:[
						{xtype:'tbfill'},
						{	text:'保存',
							formBind:true,
							disable:true,
							handler:this.btnSave,
							scope:this},	//作用域为MyWindow
						{text:'置空',handler:this.btnSetNull,scope:this},
						{text:'取消',handler:this.btnCancel,scope:this},
						{xtype:'tbfill'}
					]
			}]
		})
		this.callParent();
	},
	btnSave:function(btn,e){
		var me=this;
		var form=this.down('form')
		if(!me.url) return
		if (form.isValid()) {
			form.submit({
		        url : me.url,
		        params:me.params,
		        waitTitle : '提示',
		        success:function(form,action){
					me.hide()	
					if(me.refreshXtype)
						Ext.ComponentQuery.query(me.refreshXtype)[0].getStore().load()
					else if (me.refreshID)
						Ext.getCmp(me.refreshID).store.load();
					if(action.result.msg || '')
						alert(action.result.msg);
				},
				failure : function(form,action) {
					errorInfo=action.result.msg|| "null"
	            	alert("添加失败,错误信息："+ errorInfo)
	            }
        	})
        }
	},
	btnCancel:function(btn,e){
		this.down('form').getForm().reset()
		this.destroy()
	},
	btnSetNull:function(btn,e){
		this.down('form').getForm().reset()
	}
})