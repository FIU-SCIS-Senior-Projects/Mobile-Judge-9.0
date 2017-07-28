/**
 * This class provides the modal Ext.Window support for all Authentication forms.
 * It's layout is structured to center any Authentication dialog within it's center,
 * and provides a backGround image during such operations.
 */
Ext.define('MobileJudge.view.authentication.LockingWindow', {
	extend: 'Ext.window.Window',
	xtype: 'lockingwindow',

	requires: [
		'Ext.layout.container.VBox'
	],

	cls: 'auth-locked-window',
	closable: false,
	resizable: false,
	autoShow: true,
	titleAlign: 'center',
	maximized: true,
	modal: true,

	title: 'Mobile Judge',

	layout: {
		type: 'vbox',
		align: 'center',
		pack: 'center'
	},

	viewModel: {
		type: 'authentication'
	},
	controller: 'authentication'
});
