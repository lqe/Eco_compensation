Ext.define('ECBM.store.articles.co_website_Store',{
	extend:'Ext.data.Store',
	//requires:'ECBM.model.Ate_policles',
	model:'ECBM.model.articles.co_website_Model', 
	proxy:new Ext.data.HttpProxy({
			method : 'GET',
			url : '/admin/get?category=co_website', 	//待设置
			reader:{
				type:'json',
				root:'data',
				totalProperty:'total'
				}
	}),
	autoLoad:true
})
