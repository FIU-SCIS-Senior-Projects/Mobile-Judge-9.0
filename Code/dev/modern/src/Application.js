/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('MobileJudge.Application', {
	extend: 'Ext.app.Application',

	name: 'MobileJudge',

	defaultToken: 'home',

	mainView: 'MobileJudge.view.main.Index',

	stores: [
		'NavigationTree'
	],

	launch: function () {
		// Add a class to the body el to identify the phone profile so we can
		// override CSS styles easily. The framework adds x-phone so we could
		// use it but this way the app controls a class that is always present
		// when this profile isActive, regardless of the actual device type.
		Ext.getBody().addCls('phone');
	}
});
