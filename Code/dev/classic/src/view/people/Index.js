Ext.define('MobileJudge.view.people.Index', {
	extend: 'Ext.tab.Panel',
	xtype: 'people',

	requires: [
		'Ext.view.View',
		'Ext.grid.Panel',
		'Ext.grid.column.Action',
		'Ext.toolbar.Paging',
		'Ext.toolbar.Toolbar',
		'Ext.form.Panel',
		'Ext.form.field.File'
	],

	controller: 'people',
	viewModel: {
		type: 'people'
	},

	cls: 'shadow',
	activeTab: 0,
	margin: 20,

	defaults: {
		cls: 'user-grid',
		viewConfig: {
			preserveScrollOnRefresh: true,
			preserveScrollOnReload: true,
			loadMask: false
		},

		headerBorders: false,
		rowLines: false
	},

	items: [
		{
			xtype: 'students',
			title: 'Students',
			iconCls: 'x-fa fa-graduation-cap',
			plugins: [
				{
					ptype: 'rowediting',
					pluginId: 'gridEditor',
                    listeners: {
                        cancelEdit: 'onGridEditorCancelEdit',
						edit: 'onStudentsUpdate',
                    }
				}
			]
		},
		{
			xtype: 'judges',
			title: 'Judges',
			iconCls: 'x-fa fa-legal',
            plugins: [
                {
                    ptype: 'rowediting',
                    pluginId: 'gridEditor',
                    listeners: {
                        cancelEdit: 'onGridEditorCancelEdit',
                        edit: 'onJudgesUpdate',
                    }
                }
            ]
		}
	]
});
