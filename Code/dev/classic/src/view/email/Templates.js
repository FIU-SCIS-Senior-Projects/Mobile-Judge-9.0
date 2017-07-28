Ext.define('MobileJudge.view.email.Templates', {
	extend: 'Ext.grid.Panel',
	xtype: 'templates',

	cls: 'email-inbox-panel shadow',

	bind: {
		store: '{templates}'
	},

	viewConfig: {
		preserveScrollOnRefresh: true,
		preserveScrollOnReload: true,
		loadMask: false
	},

	listeners: {
		rowdblclick: 'onTemplateDoubleClick'
	},

	headerBorders: false,
	rowLines: false,

	tbar: [
		// Default item type for toolbar is button, thus we can skip it's definition in
		// the array items
		{
			iconCls: 'x-fa fa-edit',
			tooltip: 'New',
			handler: 'onNewTemplateButtonClick'
		},
		{
			iconCls: 'x-fa fa-refresh',
			tooltip: 'Refresh',
			handler: 'onRefreshButtonClick'
		}
	],

	columns: [
		{
			dataIndex: 'id',
			text: '',
			width: 35
		},
		{
			dataIndex: 'name',
			text: 'Title',
			width: 180
		},
		{
			dataIndex: 'subject',
			text: 'Subject',
			flex: 1
		},
		{
			xtype: 'actioncolumn',
			items: [
				{
					iconCls: 'x-fa fa-clone',
					tooltip: 'Clone',
					handler: 'onCloneButtonClick'
				},
				{
					iconCls: 'x-fa fa-close',
					tooltip: 'Delete',
					handler: 'onDeleteButtonClick'
				}
			],

			width: 70,
			dataIndex: 'bool',
			sortable: false,
			hideable: false
		}
	]
});
