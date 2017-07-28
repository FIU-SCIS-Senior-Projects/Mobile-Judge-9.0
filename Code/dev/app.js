/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */

//@require jquery.js
//@require oauth.js

Ext.application({
	name: 'MobileJudge',

	extend: 'MobileJudge.Application',

	// Simply require all classes in the application. This is sufficient to ensure
	// that all MobileJudge classes will be included in the application build. If classes
	// have specific requirements on each other, you may need to still require them
	// explicitly.
	//
	requires: [
		'MobileJudge.*'
	],

	launch: function () {
		Ext.fly('appLoadingIndicator').destroy();
		this.callParent();
	}
	//-------------------------------------------------------------------------
	// Most customizations should be made to MobileJudge.Application. If you need to
	// customize this file, doing so below this section reduces the likelihood
	// of merge conflicts when upgrading to new versions of Sencha Cmd.
	//-------------------------------------------------------------------------
});
