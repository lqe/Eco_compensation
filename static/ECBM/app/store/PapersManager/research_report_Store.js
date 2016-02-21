Ext.define('ECBM.store.PapersManager.research_report_Store',{
	extend:'Ext.data.Store',
	storeId:'research_report_Store',
	model:'ECBM.model.PapersManager.research_report_Model', 
	proxy:new Ext.data.HttpProxy({
			method : 'GET',
			url : '/admin/get?collection=papers_manager&&category=research_report', 	//待设置
			reader:{
				type:'json',
				root:'data',
				totalProperty:'total'
				},
			filterParam:'title'
	}),
	autoLoad:true
})