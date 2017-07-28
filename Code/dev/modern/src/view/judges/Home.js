Ext.define('MobileJudge.view.judges.Home', {
	extend: 'Ext.Container',
	xtype: 'judgehome',

	controller: 'judge',
	viewModel: {
		type: 'judge'
	},

	cls: 'dashboard',
	reference: 'wizard',
	layout: 'card',

	listeners: {
		activeitemchange: function(wzd, pnl) {
			var scroll = pnl.getScrollable();
			if (scroll) scroll.scrollTo(null, 0);
		}
	},

	items: [
		{
			xtype: 'judgestudents'
		},
		{
			xtype: 'judgequestion'
		}
	]

});
