Ext.define('MobileJudge.view.email.Menu', {
	extend: 'Ext.menu.Menu',

	alias: 'widget.emailmenu',

	title: 'Email',

	iconCls: 'x-fa fa-envelope-o',

	floating: false,

	defaults: {
		href: 'javascript:void(0)'
	},

	items: [
		{
			routeId: 'emailwizard', //xtype and used for url routing
			params: {
				openWindow: true, // Let the controller know that we want this component in the window,
				targetCfg: {
					//put any extra configs for your view here
				},
				windowCfg: {
					// Any configs that you would like to apply for window popup goes here
					title: 'Send Email Wizard',
					autoShow: true,
					controller: 'sendemail',
					viewModel: {
						type: 'sendemail'
					}
				}
			},
			iconCls: 'x-fa fa-send-o',
			text: 'Send Email'
		},
		{
			routeId: 'outbox',
			iconCls: 'x-fa fa-inbox',
			text: 'All Email Sent'
		},
		{
			routeId: 'templates',
			iconCls: 'x-fa fa-files-o',
			text: 'Templates'
		},
		{
			routeId: 'placeholders',
			iconCls: 'x-fa fa-file-code-o',
			text: 'Placeholders'
		}
	]
});
