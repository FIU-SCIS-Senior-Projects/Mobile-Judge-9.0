Ext.define('MobileJudge.view.students.Home', {
	extend: 'Ext.container.Container',
	xtype: 'studenthome',

	requires: [
		'Ext.ux.layout.ResponsiveColumn'
	],

	layout: 'responsivecolumn',
	cls: 'userProfile-container',

	controller: 'student',
	viewModel: {
		data: {
		}
	},

	items: [
		{
			// Always 100% of container
			xtype: 'profile',
			userCls: 'big-100 small-100 shadow'
		}
	]

});
