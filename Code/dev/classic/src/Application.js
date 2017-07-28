Ext.define('MobileJudge.Application', {
	extend: 'Ext.app.Application',

	name: 'MobileJudge',

	stores: [
		'NavigationTree'
	],

	defaultToken: 'home',

	// The name of the initial view to create. This class will gain a "viewport" plugin
	// if it does not extend Ext.Viewport.
	//
	mainView: 'MobileJudge.view.main.Index',

	onAppUpdate: function () {
		Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
			function (choice) {
				if (choice === 'yes') {
					window.location.reload();
				}
			}
		);
	}
});
