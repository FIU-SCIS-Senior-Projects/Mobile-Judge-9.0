Ext.define('MobileJudge.view.main.Index', {
	extend: 'Ext.container.Viewport',

	requires: [
		'Ext.list.Tree'
	],

	controller: 'main',
	viewModel: 'main',

	cls: 'sencha-dash-viewport',
	itemId: 'mainView',

	layout: {
		type: 'vbox',
		align: 'stretch'
	},

	items: [
		{
			xtype: 'toolbar',
			cls: 'sencha-dash-dash-headerbar shadow',
			height: 64,
			itemId: 'headerBar',
			items: [
				{
					xtype: 'component',
					reference: 'senchaLogo',
					cls: 'sencha-logo',
					html: '<div class="main-logo"><img src="resources/images/company-logo.png">Mobile Judge</div>',
					width: 250
				},
				{
					margin: '0 0 0 8',
					ui: 'header',
					iconCls: 'x-fa fa-navicon',
					id: 'main-navigation-btn',
					handler: 'onToggleNavigationSize'
				},
				{
					xtype: 'tbtext',
					bind: {
						text: '{activeTerm}'
					},
					cls: 'top-term-name'
				},
				'->',
				{
					xtype: 'tbtext',
					bind: {
						text: '{userName}'
					},
					cls: 'top-user-name'
				},
				{
					xtype: 'image',
					cls: 'header-right-profile-image',
					height: 35,
					width: 35,
					alt: 'current user image',
					bind: {
						src: '{profilePic}'
					}
				},
				{
					iconCls: 'x-fa fa-sign-out',
					ui: 'header',
					handler: 'onLogout',
					tooltip: 'Logout'
				}
			]
		},
		{
			xtype: 'maincontainerwrap',
			id: 'main-view-detail-wrap',
			reference: 'mainContainerWrap',
			flex: 1,
			items: [
				{
					xtype: 'treelist',
					reference: 'navigationTree',
					itemId: 'navigationTreeList',
					ui: 'navigation',
					store: 'NavigationTree',
					width: 250,
					expanderFirst: false,
					expanderOnly: false,
					listeners: {
						selectionchange: 'onNavigationTreeSelectionChange'
					}
				},
				{
					xtype: 'container',
					flex: 1,
					reference: 'mainCard',
					cls: 'sencha-dash-right-main-container',
					itemId: 'contentPanel',
					layout: {
						type: 'card',
						anchor: '100%'
					}
				}
			]
		}
	]
});
