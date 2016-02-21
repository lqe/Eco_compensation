Ext.define('ECBM.store.SystemManager.personnel_info_Store',{
	extend:'Ext.data.Store',
	//storeId:'personnel_info_Store',
	model:'ECBM.model.SystemManager.personnel_info_Model', 
	proxy:new Ext.data.HttpProxy({
			method : 'GET',
			url : '/admin/get?collection=personnel_info', 	//待设置
			reader:{
				type:'json',
				root:'data',
				totalProperty:'total'
				}
	}),
	autoLoad:true
})