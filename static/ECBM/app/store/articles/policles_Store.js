Ext.define('ECBM.store.articles.policles_Store',{
	extend:'Ext.data.Store',
	model:'ECBM.model.articles.policles_Model', 
	proxy:new Ext.data.HttpProxy({
			method : 'GET',
			url : '/admin/get?category=policies', 	//待设置
			reader:{
				type:'json',
				root:'data',
				totalProperty:'total'
				}
	}),
	autoLoad:true
			       
})
