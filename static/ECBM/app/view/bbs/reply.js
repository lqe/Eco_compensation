
var items=[{
        xtype: 'panel' implied by default
        title: 'West Region is collapsible',
        region:'west',
        xtype: 'panel',
        margins: '5 0 0 5',
        width: 200,
        collapsible: true,   // make collapsible
        id: 'west-region-container',
        layout: 'fit'
    },{
        title: 'Center Region',
        region: 'center',     // center region is required, no width/height specified
        xtype: 'panel',
        layout: 'fit',
        margins: '5 5 0 0'
    }];

/* border布局的面板*/
Ext.define('ECBM.view.bbs.section',{
	extend:'Ext.panel.Panel',
	alias:'widget.section',
	layout:{
		type:'border'
	},
})

