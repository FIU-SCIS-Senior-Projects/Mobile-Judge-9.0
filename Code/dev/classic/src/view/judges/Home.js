Ext.define('MobileJudge.view.judges.Home', {
	extend: 'Ext.container.Container',
	xtype: 'judgehome',

	controller: 'judge',
	viewModel: {
		type: 'judge'
	},

	items: [
		{
			xtype: 'container',
			reference: 'wizard',
			layout: 'card',
			margin: 20,
			items: [
				{
					xtype: 'judgestudents',
					bind: '{students}'
				},
				{
					xtype: 'judgequestion'
				}
			]
		}
	]

});
