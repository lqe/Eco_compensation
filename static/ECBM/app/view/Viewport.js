Ext.define('ECBM.view.Viewport',{
	extend:'Ext.container.Viewport',
	layout:'border',
	require:[
		'ECBM.view.MenuTree',
		'ECBM.view.MainPanel',
		'ECEB.view.ul.*'
	],
	items:[
		{  
	 		region:'north',  
			html: '<div id="header" style="background:#DFE8F6;height:40px;overflow:hidden">' +
					   '<div  style="float:left;padding:8px 30px 0 0;" ><font style="font-weight:bold;font-size:18px;">生态补偿与绿色发展知识共享平台</font></div>' +
					   '<div  style="float:left;padding-top:20px;" ><span style="font-size:12px">欢迎您，'+rolename+'</span></div>' +
					   '<span style="float:right;padding:10px 10px;color:#000 ">' +
					   		 '<a style="margin-right:10px" href="javascript:void(0)" onclick="update_pwd()">修改密码</a>' +
					   		 '<a style="margin-right:10px" href="/" target="_blank">前台入口</a>' +
					         '<a style="margin-right:10px" href="/reset/'+ Ext.fly("Htmlvar").dom.innerHTML+'">注销</a>' +
					   '</span>' +
					  '</div>'
		},
		Ext.create('ECBM.view.Left_Nav',{title: '菜单'}),
		Ext.create('ECBM.view.MainPanel')
	     ]  
});
