Ext.define('MobileJudge.view.admin.Home', {
	extend: 'Ext.container.Container',
	xtype: 'adminhome',

	requires: [
		'Ext.ux.layout.ResponsiveColumn'
	],

	controller: 'charts',
	viewModel: {
		type: 'charts'
	},
	layout: 'responsivecolumn',

	defaultType: 'basepie',
	defaults: {
		iconCls: 'x-fa fa-pie-chart',
		userCls: 'big-33 small-100',
		height: 300,
		defaults: {
			animation : !Ext.isIE9m && Ext.os.is.Desktop
		}
	},

	items: [
		{
			xtype:'chartjudges',
			height: 400,
			userCls: 'big-100 small-100'
		},
		{
			title: 'Students',
			items: [
				{
					xtype: 'smallpie',
					bind: '{students}'
				}
			]
		},
		{
			title: 'Graded',
			items: [
				{
					xtype: 'smallpie',
					bind: '{graded}'
				}
			]
		},
		{
			title: 'Accepted',
			items: [
				{
					xtype: 'smallpie',
					bind: '{accepted}'
				}
			]
		}
	]
});
