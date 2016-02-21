Ext.define('ECBM.store.articles.contact_Store',{
	extend:'Ext.data.Store',
	//requires:'ECBM.model.Ate_policles',
	model:'ECBM.model.articles.contact_Model', 
	proxy:new Ext.data.HttpProxy({
			method : 'GET',
			url : '/admin/get?category=contact_way', 	//待设置
			reader:{
				type:'json',
				root:'data',
				totalProperty:'total'
				}
	}),
	autoLoad:true
			       
})
