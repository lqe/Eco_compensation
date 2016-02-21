/* border布局的面板*/
Ext.define('ECBM.view.bbs.section',{
	extend:'Ext.panel.Panel',
	alias:'widget.section',
	layout:{
		type:'border',
		paddind:10
	},
	items:[{
        xtype: 'sectionNav',
        title: '所有版块',
        region:'west',
        margins: '5 0 5 0',
        width: 200,
        collapsible: true   // make collapsible
    },{
        title: '版块详情',
        region: 'center',     // center region is required, no width/height specified
        xtype: 'topic'
    }]
})

