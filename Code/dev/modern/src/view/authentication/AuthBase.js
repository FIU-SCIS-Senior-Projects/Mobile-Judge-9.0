Ext.define('MobileJudge.view.authentication.AuthBase', {
	extend: 'Ext.Panel',

	requires: [
		'Ext.MessageBox',
		'Ext.layout.VBox'
	],

	baseCls: 'auth-locked',

	layout: {
		type: 'vbox',
		align: 'center',
		pack: 'center'
	},

	scrollable: true,

	controller: 'authentication',
	viewModel: {
		type: 'authentication'
	}
});
