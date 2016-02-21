Ext.onReady(function(){
	Ext.tip.QuickTipManager.init();
	ShowTime()
	setInterval("ShowTime()",1000) 
	Ext.select("input[value='当前时间']").on("click",ShowTime)
	var classificationStore = Ext.create('Ext.data.Store',
	{
		fields:['value'],
		proxy:{
			type:'ajax',
			url:'/Get/classification?name_id='+Ext.fly('Htmlvar').dom.innerHTML,
			reader:{
				type:'json',
				root:'data'
			}
		},
		autoLoad:true
	});
	new Ext.form.field.ComboBox({
		renderTo:Ext.get("classification"),
		width:124,
		name:'classification',
		store:classificationStore,
		displayField:'value',
		valueField:'value',
		queryMode:'local',
	});

	new ECBM.view.ul.MyHtmlEditor({
		renderTo:Ext.get("textarea_id"),
		url:'/upload?filedir=blog_content_img',
		width:860,
		height:470
		})
	load()
	Ext.fly("btn").on("click",AjaxPost)
	});
load=function(){
	blogtemp=Ext.fly("HtmlBlog").dom.innerHTML
	if (!blogtemp) return
	blog=Ext.JSON.decode(blogtemp)[0]
	Ext.select('[name]').each(function(el,index,myself){
		dom=el.dom
		switch(dom.name){
			case 'title':
				dom.value=blog['title']
				break;
			case 'content':
				dom.innerHTML=blog['content']
				break;
			case 'classification':
				dom.value=blog['classification']
				break;
			case '_id':
				dom.value=blog['_id']
				break;
		}
	});
	Ext.fly('btn').dom.value="保存博文"
}
ShowTime=function(){
		var date=new Date()
		temp=Ext.Date.format(date,'Y-m-d H:i:s')
		Ext.select("input[name='date']").elements[0].value=temp
	}

AjaxPost=function(){
	Ext.Ajax.request({
		url:'/write_blog',
		method:'POST',
		form:'formId',
		params:{},
		waitMsg : '正在发布,请稍候...',
        success : function(response) {
        	var json = response.responseText
        	var dict=Ext.JSON.decode(json)
        	temp=Ext.fly('btn').dom.value  //获取按钮的值
        	alert(dict["msg"])
        	window.location.href='/blog_content_manage?name_id='+Ext.fly('Htmlvar').dom.innerHTML
        },
        failure : function(response) {
            alert("发送失败")
            }
        });	
}