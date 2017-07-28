Ext.define('MobileJudge.view.email.Placeholders', {
	extend: 'Ext.grid.Panel',
	xtype: 'placeholders',

	requires: [
		'Ext.grid.plugin.RowEditing'
	],

	cls: 'email-inbox-panel shadow',

	bind: {
		store: '{placeholders}'
	},

	viewConfig: {
		preserveScrollOnRefresh: true,
		preserveScrollOnReload: true,
		loadMask: false
	},

	headerBorders: false,
	rowLines: false,
	plugins: [
		{
			ptype: 'rowediting',
			pluginId: 'gridEditor',
			listeners: {
				cancelEdit: 'onGridEditorCancelEdit'
			}
		}
	],

	tbar: [
		// Default item type for toolbar is button, thus we can skip it's definition in
		// the array items
		{
			iconCls: 'x-fa fa-edit',
			reference: 'newButton',
			tooltip: 'New',
			handler: 'onNewPlaceholderButtonClick'
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
			width: 35,
			renderer: function(v, meta, rec) {
				return rec.phantom ? '' : v;
			}
		},
		{
			dataIndex: 'code',
			text: 'Code',
			width: 100,
			editor: {
				xtype: 'textfield',
				allowBlank: false
			}
		},
		{
			dataIndex: 'text',
			text: 'Text',
			width: 160,
			editor: {
				xtype: 'textfield',
				allowBlank: false
			}
		},
		{
			dataIndex: 'value',
			text: 'Expression',
			renderer: Ext.util.Format.htmlEncode,
			flex: 1,
			editor: {
				xtype: 'textfield',
				allowBlank: false
			}
		},
		{
			xtype: 'actioncolumn',
			items: [
				{
					iconCls: 'x-fa fa-close',
					tooltip: 'Delete',
					handler: 'onDeleteButtonClick'
				}
			],

			width: 40,
			dataIndex: 'bool',
			sortable: false,
			hideable: false
		}
	]
});
