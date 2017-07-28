Ext.define('MobileJudge.view.settings.Index', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.settings',

	controller: 'settings',
	viewModel: {
		type: 'settings'
	},

	cls: 'shadow',
	activeTab: 0,
	margin: 20,

	items: [
		{
			xtype: 'terms'
		},
		{
			xtype: 'questions'
		}
	]
});
