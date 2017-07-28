Ext.define('MobileJudge.view.students.Home', {
	extend: 'Ext.Container',
	xtype: 'studenthome',

	cls: 'userProfile-container dashboard',
	scrollable: 'y',

	controller: 'student',
	viewModel: {
		data: {
		}
	},

	items: [
		{
			// Always 100% of container
			xtype: 'profile',
			userCls: 'big-100 small-100 dashboard-item shadow'
		}
	]

});
