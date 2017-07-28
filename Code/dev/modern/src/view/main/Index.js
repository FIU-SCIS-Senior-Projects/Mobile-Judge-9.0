Ext.define('MobileJudge.view.main.Index', {
	extend: 'Ext.Container',
	requires: [
		'Ext.Button',
		'Ext.list.Tree',
		'Ext.navigation.View'
	],

	controller: 'main',
	viewModel: 'main',

	layout: 'hbox',

	items: [
		{
			xtype: 'maintoolbar',
			docked: 'top',
			id: 'maintoolbar',
			reference: 'maintoolbar',
			userCls: 'main-toolbar shadow'
		},
		{
			xtype: 'container',
			userCls: 'main-nav-container',
			reference: 'navigation',
			scrollable: true,
			items: [
				{
					xtype: 'treelist',
					reference: 'navigationTree',
					ui: 'navigation',
					store: 'NavigationTree',
					expanderFirst: false,
					expanderOnly: false,
					listeners: {
						itemclick: 'onNavigationItemClick',
						selectionchange: 'onNavigationTreeSelectionChange'
					}
				}
			]
		},
		{
			xtype: 'navigationview',
			flex: 1,
			reference: 'mainCard',
			userCls: 'main-container',
			navigationBar: false
		}
	]
});
