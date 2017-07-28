Ext.define('MobileJudge.view.people.Judges', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.judges',

	requires: [
		'Ext.grid.plugin.RowEditing',
		'Ext.grid.column.Action',
		'Ext.form.field.Checkbox',
		'Ext.form.field.Number',
		'Ext.form.field.Text',
		'Ext.toolbar.Toolbar'
	],

	bind: '{judges}',

	dockedItems: [
		{
			xtype: 'toolbar',
			dock: 'top',
			items: [
                {
                    xtype: 'dataview',
                    tpl: [

                        '<tpl>',
                        '<input type="checkbox" id="chkid2" onClick="onCheckChange(this)"/>',
                        '</tpl>',
                    ]
                },
				{
					xtype: 'dataview',
					cls: 'stateSelector',
                    id:'filterbtn2',
					loadMask: false,
					trackOver: false,
					itemSelector: '.stateSelector button',
					selectedItemCls: 'selected',
					selectionModel: {
						type: 'dataviewmodel',
						storeId: 'judges',
						mode: 'SIMPLE'
					},
					tpl: [
                        '<tpl for=".">',
                        	'<button type="button" title="{name}" id="{name}">{abbr}</button>',
                        '</tpl>'
					],
					bind: {
						selection: '{judgeFilterSelection}',
						store: '{judgeStates}'
					},
					listeners: {
						selectionchange: 'onFilterChange'
					}
				},
				'->',
				{
					xtype: 'searchfilter',
					width: 350,
					fieldLabel: 'Search',
					labelWidth: 50,
					bind: {
						store: '{judges}'
					}
				},
				'->',
                {
                    ui: 'soft-blue',
                    glyph: '',
                    iconCls: 'x-fa fa-cloud-download',
                    text: 'Judge Report',
                    handler: 'onExportJudgeReport'
                },
                '->',
                {
                    ui: 'soft-blue',
                    glyph:'',
                    iconCls: 'x-fa fa-cloud-download',
                    text: 'Template',
                    handler: 'onJudgeTemplateDownload'
                },
                '->',
				{
					xtype: 'form',
					reference: 'judgeUploadForm',
					items: [
						{
							xtype: 'filefield',
							name: 'judgesCsv',
							buttonOnly: true,
							buttonText: 'Import',
							buttonConfig: {
								ui: 'soft-blue',
								glyph:'',
								iconCls: 'x-fa fa-cloud-upload'
							},
							listeners: {
								change: 'onImportJudges'
							}
						}
					]
				}
			]
		},
		{
			xtype: 'pagingtoolbar',
			dock: 'bottom',
			displayInfo: true,
			bind: '{judges}'
		}
	],
	columns: [
		{
            xtype: 'gridcolumn',
			width: 75,
			dataIndex: 'id',
            id: 'JudgeIdxColumn',
			hideable: false,
			text: ''
		},
		{
            xtype: 'gridcolumn',
			renderer: function(value) {
				return "<img class='profilePic' src='" + value + "' alt='Profile Pic' height='40px' width='40px'>";
			},
			width: 75,
			dataIndex: 'profileImgUrl',
			sortable: false,
			hideable: false,
			text: ''
		},
		{
            xtype: 'gridcolumn',
			dataIndex: 'fullName',
			text: 'Name',
            id: 'JudgeNameColumn',
			flex: 1,
            editor: {
                xtype: 'textfield',
                allowBlank: false

            }
		},
		{
            xtype: 'gridcolumn',
			dataIndex: 'email',
			text: 'Email',
            id: 'JudgeEmailColumn',
			flex: 2,
            editor: {
                xtype: 'textfield',
				vtype: 'email',
                allowBlank: false

            }
		},
		{
            xtype: 'gridcolumn',
			dataIndex: 'title',
			text: 'Title',
            id: 'JudgeTitleColumn',
			flex: 1,
            editor: {
                xtype: 'textfield'
            }
		},
		{
            xtype: 'gridcolumn',
			dataIndex: 'affiliation',
			text: 'Organization',
            id: 'JudgeOrgColumn',
			flex: 1,
            editor: {
                xtype: 'textfield'
            }
		},
		{
            xtype: 'gridcolumn',
			dataIndex: 'state',
            id: 'JudgeStateColumn',
			text: 'State',
			width: 120,
            editor: {
                xtype: 'combobox',
                editable: false,
                forceSelection: false,
                triggerAction: 'all',
                queryMode: 'local',
                queryCaching: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['id', 'name'],
                    data : [
                        {"id":"1", "name":"Prospective"},
                        {"id":"2", "name":"Invited"},
                        {"id":"3", "name":"Rejected"},
                        {"id":"4", "name":"Pending"},
                        {"id":"5", "name":"Registered"},
                        {"id":"6", "name":"Attended"},
                        {"id":"7", "name":"Started Grading"},
                        {"id":"8", "name":"Graded"},
                        {"id":"12", "name":"Removed"}

                    ]
                }),
                displayField: 'name',
                valueField: 'id',
                listeners: {
                    select: function (combo, recs, opts) {
                        combo.fireEvent('blur');
                    }

                },
            },
		},
		{
			xtype: 'actioncolumn',
			items: [
				{
					iconCls: 'x-fa fa-close',
					tooltip: 'Delete',
					handler: 'onUserDelete'
				}
			],

			width: 40,
			dataIndex: 'bool',
			sortable: false,
			hideable: false
		}
	]
});
