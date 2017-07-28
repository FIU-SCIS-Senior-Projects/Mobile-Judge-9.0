Ext.define('MobileJudge.view.main.Toolbar', {
	extend: 'Ext.Toolbar',
	xtype: 'maintoolbar',

	items: [
		{
			// This component is moved to the floating nav container by the phone profile
			xtype: 'component',
			reference: 'logo',
			userCls: 'main-logo',
			html: 'Mobile Judge'
		},
		{
			xtype: 'button',
			ui: 'header',
			iconCls: 'x-fa fa-bars',
			margin: '0 0 0 10',
			listeners: {
				tap: 'onToggleNavigationSize'
			}
		},
		{
			xtype: 'component',
			bind: {
				html: '{activeTerm}'
			},
			margin: '0 12 0 4',
			userCls: 'main-user-name'
		},
		'->',
		{
			xtype: 'image',
			userCls: 'main-user-image small-image circular',
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
});
