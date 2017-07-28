Ext.define('MobileJudge.view.judges.Students', {
	extend: 'Ext.grid.Panel',
	xtype: 'judgestudents',

	userCls: 'user-grid shadow',
	title: 'Students',

	tools: [
		{
			type: 'refresh',
			handler: 'onStudentsRefresh'
		}
	],

	viewConfig: {
		stripeRows: true,
		enableTextSelection: false,
		loadMask: false,
		markDirty: false
	},

	disableSelection: true,
	enableColumnHide: false,
	enableColumnMove: false,
	enableColumnResize: false,
	sortableColumns: false,
	headerBorders: false,
	columns:[
		{
			renderer: function(value) {
				return "<img class='profilePic' src='" + value + "' alt='Profile Pic' height='40px' width='40px'>";
			},
			width: 75,
			dataIndex: 'profileImgUrl',
			text: ''
		},
		{
			dataIndex: 'fullName',
			text: 'Name',
			flex: 1
		},
		{
			dataIndex: 'project',
			text: 'Project',
			flex: 2
		},
		{
			dataIndex: 'location',
			text: 'Location',
			flex: 1,
			renderer: function(value) {
				return '<a href="#map" class="location">' + value + '</a>';
			}
		},
		{
			xtype: 'actioncolumn',
			dataIndex: 'progress',
			tdCls: 'grading',
			width: 40,
			items: [
				{
					handler: 'onGrade',
					getClass: function(v) {
						return 'x-fa fa-' + (v == 1 ? 'check' : 'edit');
					},
					isDisabled: function(view, rowIndex, colIndex, item, record) {
						return record.get('accepted') == record.get('total');
					},
					getTip: function(v) {
						switch(v) {
							case 0: return 'Grade Now!';
							case 1: return 'Thanks!';
						}
						return 'Continue Grading';
					}
				}
			]
		}
	]
});
