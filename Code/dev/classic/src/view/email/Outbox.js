Ext.define('MobileJudge.view.email.Outbox', {
	extend: 'Ext.grid.Panel',
	xtype: 'outbox',

	requires: [
		'Ext.toolbar.Paging',
		'Ext.grid.column.Date'
	],

	cls: 'email-inbox-panel shadow',

	bind: {
		store: '{outbox}'
	},

	viewConfig: {
		preserveScrollOnRefresh: true,
		preserveScrollOnReload: true,
		loadMask: false
	},

	listeners: {
		rowdblclick: 'onEmailDoubleClick'
	},

	headerBorders: false,
	rowLines: false,

	tbar: [
		// Default item type for toolbar is button, thus we can skip it's definition in
		// the array items
		{
			iconCls: 'x-fa fa-edit',
			tooltip: 'Send New Mail',
			handler: 'onNewEmailButtonClick'
		},
		{
			iconCls: 'x-fa fa-refresh',
			tooltip: 'Refresh',
			handler: 'onRefreshButtonClick'
		},
		'->',
		{
			xtype: 'searchfilter',
			width: 400,
			fieldLabel: 'Search',
			labelWidth: 50,
			bind: {
				store: '{outbox}'
			}
		},
		'->'
	],

	columns: [
		{
			dataIndex: 'fullName',
			text: 'To',
			width: 180
		},
		{
			dataIndex: 'subject',
			text: 'Subject',
			flex: 1
		},
		{
			xtype: 'datecolumn',
			dataIndex: 'sent',
			width: 170,
			text: 'Sent',
			format: 'm/d/Y g:i:s a'
		},
		{
			xtype: 'datecolumn',
			dataIndex: 'replied',
			width: 170,
			text: 'Replied',
			hidden: true,
			format: 'm/d/Y g:i:s a'
		},
		{
			dataIndex: 'state',
			text: 'State',
			width: 100,
			hidden: true
		}
	],
	dockedItems: [
		{
			xtype: 'pagingtoolbar',
			dock: 'bottom',
			displayInfo: true,
			bind: {
				store: '{outbox}'
			}
		}
	]
});
