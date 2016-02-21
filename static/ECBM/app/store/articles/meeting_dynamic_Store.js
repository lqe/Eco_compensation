Ext.define('ECBM.store.articles.meeting_dynamic_Store',{
	extend:'Ext.data.Store',
	model:'ECBM.model.articles.meeting_dynamic_Model',
	proxy:new Ext.data.HttpProxy({
			method : 'GET',
	        url : '/meeting/get/baseInfor',
			reader:{
				type:'json',
				root:'data',
				totalProperty:'total'
				}
	}),
	autoLoad:true		       
})
