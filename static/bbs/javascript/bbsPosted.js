Ext.onReady(function(){
	ShowTime()
	setInterval("ShowTime()",1000) 
	Ext.select("input[value='当前时间']").on("click",ShowTime)
	
	Ext.create("ECBM.view.ul.MyHtmlEditor",{
		renderTo:Ext.get("textarea_id"),
		//url:'/upload',
		width:760,
		height:300,
		name:'TContents'
		})
	new Ext.form.field.Text({
		renderTo:Ext.get("classification"),
		fieldLabel:'标签',
		labelWidth:60,
		padding:"10 0",
		emptyText:'可选标签',
		width:400,
		name:'TFalg'
	});
	Ext.create('Ext.form.field.ComboBox',{
		renderTo:Ext.get("Group"),
		width:200,
		fieldLabel:'版块',
		labelWidth:60,
		emptyText:'大板块',
		name:'GName',
		forceSelection:true,
		store:Ext.create('My.groupStore'),
		displayField:'GName',
		valueField:'GName',
		queryMode:'local',
		listeners:{
				select:function(combo,ecords){
					var sectionCombobox=Ext.getCmp("sectionCombobxID");
					if (sectionCombobox){
						sectionCombobox.reset();
						sectionCombobox.getStore().load({
							params:{
								GName:combo.getValue()
							}
						});
					}
				}
			}
	});
	Ext.create('Ext.form.field.ComboBox',{
		renderTo:Ext.get("Section"),
		width:140,
		padding:"0 10",
		id:'sectionCombobxID',
		emptyText:'小版块',
		name:'SName',
		forceSelection:true,
		store:Ext.create('My.sectionStore'),
		displayField:'SName',
		valueField:'SName',
		queryMode:'local',
	});
	new Ext.form.field.Number({
		renderTo:Ext.get("score"),
		width:144,
		fieldLabel:'结贴分数',
		forceSelection:true,
		id:'TScore',
		labelWidth:60,
		padding:"10 0",
		value:0,
		minValue:0,
		maxValue:parseInt(Ext.get("maxScoreValue").dom.innerHTML),
		name:'TScore',
		listeners:{
			blur:function(pan){
				var va=parseInt(Ext.get("maxScoreValue").dom.innerHTML);
				if (pan.value>va)
					pan.setValue(va)
			}
		}
	});
	Ext.fly("btn").on("click",AjaxPost)
})

//加载
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

//显示时间
ShowTime=function(){
		var date=new Date()
		temp=Ext.Date.format(date,'Y-m-d H:i:s')
		Ext.select("input[name='TTime']").elements[0].value=temp
	}

//发布
AjaxPost=function(){
	var t=true
	Ext.select('[name]').each(function(el,index,myself){
		name=el.dom.name
		if (name=='title'||name=='GName'||name=='SName'){
			if(! el.dom.value){
				t=false
			} 
		else if(name=='TScore'){
			var va=parseInt(Ext.get("maxScoreValue").dom.innerHTML);
			if( parseInt(el.dom.value) >va)
				el.dom.value=va
		}
		}
	}); 
	if(!t){
		alert("信息不完整");
		return
	}
	Ext.Ajax.request({
		url:'/bbs/posted',
		method:'POST',
		form:'formId',
		params:{},
		waitMsg : '正在发布,请稍候...',
        success : function(response) {
        	var json = response.responseText
        	var dict=Ext.JSON.decode(json)
        	temp=Ext.fly('btn').dom.value  //获取按钮的值
        	window.location.href='./reply/replyPage?TId='+dict["msg"]
        },
        failure : function(response) {
            alert("发送失败")
            }
        });	
};

//get all collage name from database	
Ext.define('My.groupStore',{
	extend:'Ext.data.Store',
	fields:['GName'],
	proxy:{
		type:'ajax',
		url:'/bbs/group/getGName',
		reader:{
			type:'json',
			root:'data'
		}
	},
	autoLoad:true
})

/*need _cfg{sectionId,classId,store}*/
Ext.define('My.groupCombobox',{
	extend:'Ext.form.ComboBox',
	config:{
			id:null,
			sectionId:null,
			classId:null,
			fieldLabel:'',
			name:'GName',
			labelWidth:30,
			forceSelection:true,
			displayField:'GName',
			valueField:'GName',
			queryModel:'local',
			store:null
	},
	constructor: function(_cfg){
		this.initConfig(_cfg)
		this.superclass.constructor.call(this);
	},
	initComponent:function(){
		this.listeners={
				select:function(combo,ecords){
					var sectionCombobox=Ext.getCmp(combo.sectionId);
					if (sectionCombobox){
						sectionCombobox.reset();
						sectionCombobox.getStore().load({
							params:{
								GName:combo.getValue()
							}
						});
					}
				}
			}	
		this.callParent(arguments);
	}
});
//get all section name from database	
Ext.define('My.sectionStore',{
	extend:'Ext.data.Store',
	fields:['SName'],
	proxy:{
		type:'ajax',
		url:'/bbs/group/getSName',
		reader:{
			type:'json',
			root:'data'
			}
		}
})
/*need _cfg{id,store}*/
Ext.define('My.sectionCombobox',{
	extend:'Ext.form.ComboBox',
	config:{
		id:null,
		fieldLabel:'',
		name:'SName',
		labelWidth:30,
		store:null,
		forceSelection:true,
		displayField:'SName',
		valueField:'SName',
		queryModel:'local'
	},
	constructor: function(_cfg){
		this.initConfig(_cfg);
		this.superclass.constructor.call(this);
	}
});
//get all class name from database  requres:majorName
