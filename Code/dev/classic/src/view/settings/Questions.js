Ext.define('MobileJudge.view.settings.Questions', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.questions',

	requires: [
		'Ext.grid.plugin.RowEditing',
		'Ext.grid.column.Action',
		'Ext.form.field.Checkbox',
		'Ext.form.field.Number',
		'Ext.form.field.Text',
		'Ext.toolbar.Toolbar'
	],

	title: 'Questions',
	iconCls: 'x-fa fa-question',

	bind: '{questions}',

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
				cancelEdit: 'onQuestionCancelEdit'
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
			handler: 'onNewQuestionButtonClick'
		},
		{
			iconCls: 'x-fa fa-refresh',
			tooltip: 'Refresh',
			handler: 'onRefreshButtonClick'
		}
	],
	columns: [
		{
			width: 40,
			dataIndex: 'id',
			text: '',
			renderer: function(v, meta, rec) {
				return rec.phantom ? '' : v;
			}
		},
		{
			flex: 1,
			dataIndex: 'text',
			text: 'Question',
			editor: {
				xtype: 'textfield',
				allowBlank: false
			}
		},
		{
			width: 75,
			align: 'center',
			dataIndex: 'value',
			text: 'Max',
			editor: {
				xtype: 'numberfield',
				minValue: 1,
				maxValue: 10,
				allowBlank: false
			}
		},
		{
			width: 75,
			align: 'center',
			dataIndex: 'display',
			text: 'Order',
			editor: {
				xtype: 'numberfield',
				minValue: 1,
				allowBlank: false
			}
		},
		{
			width: 75,
			align: 'center',
			dataIndex: 'enabled',
			text: 'Enabled',
			renderer: function(value) {
				return '<span class="x-fa '+ (value ? 'fa-check' : '') +'"></span>';
			},
			editor: 'checkboxfield'
		},
		{
			xtype: 'actioncolumn',
			items: [
				{
					iconCls: 'x-fa fa-close',
					tooltip: 'Delete',
					handler: 'onQuestionDelete'
				}
			],

			width: 30,
			dataIndex: 'bool',
			sortable: false,
			hideable: false
		}
	]
});
