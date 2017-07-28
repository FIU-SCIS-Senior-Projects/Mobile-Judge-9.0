Ext.define('MobileJudge.view.people.Students', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.students',

    requires: [
        'Ext.grid.plugin.RowEditing',
        'Ext.grid.column.Action',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.toolbar.Toolbar'
    ],

    bind: {store: '{students}'},
    references: 'gridStudents',

    dockedItems: [
        {

            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    xtype: 'dataview',
                    tpl: [

                        '<tpl>',
                        '<input type="checkbox" id="chkid" onClick="onCheckChange(this)"/>',
                        '</tpl>',
                    ]
                },

                {
                    xtype: 'dataview',
                    id: 'filterbtn',
                    cls: 'stateSelector',
                    loadMask: false,
                    trackOver: false,
                    itemSelector: '.stateSelector button',
                    selectedItemCls: 'selected',
                    selectionModel: {
                        type: 'dataviewmodel',
                        storeId: 'students',
                        mode: 'SIMPLE'
                    },
                    tpl: [
                        '<tpl for=".">',
                        '<button type="button" title="{name}" id="{name}">{abbr}</button>',
                        '</tpl>',

                    ],
                    bind: {
                        selection: '{studentFilterSelection}',
                        store: '{studentStates}'
                    },
                    listeners: {
                        selectionchange: 'onFilterChange'
                    }

                },

                '->',
                {
                    xtype: 'searchfilter',
                    width: 400,
                    fieldLabel: 'Search',
                    labelWidth: 50,
                    bind: {
                        store: '{students}'
                    }
                },
                '->',
                {
                    ui: 'soft-blue',
                    glyph: '',
                    iconCls: 'x-fa fa-cloud-download',
                    text: 'Download Report',
                    handler: 'onExportReport'
                },
                '->',
                {
                    ui: 'soft-blue',
                    glyph: '',
                    iconCls: 'x-fa fa-cloud-download',
                    text: 'Sync',
                    handler: 'onStudentsLoad'
                }
            ]
        },
        {
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            bind: '{students}'
        }
    ],
    columns: [
        {
            xtype: 'gridcolumn',
            width: 75,
            dataIndex: 'id',
            id: 'idxColumn',
            hideable: false,
            text: '',
        },
        {
            xtype: 'gridcolumn',
            renderer: function (value) {
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
            id: 'nameColumn',
            text: 'Name',
            flex: 1,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'email',
            id: 'emailColumn',
            text: 'Email',
            flex: 1,
            editor: {
                xtype: 'textfield',
                vtype: 'email',
                allowBlank: false
            }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'project',
            id: 'comboProjects',
            text: 'Project',
            flex: 2,
            editor: {
                xtype: 'combobox',
                editable: false,
                forceSelection: false,
                triggerAction: 'all',
                queryMode: 'remote',
                queryCaching: false,
                store: new Ext.data.ArrayStore({
                    autoLoad: true,
                    proxy: new Ext.data.HttpProxy({
                        url: "/api/projects",
                        method: 'POST'
                    }),

                    fields: ['id', 'name'],

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
            xtype: 'gridcolumn',
            dataIndex:'location',
            text: 'Location',
            id: 'locationColumn',
            flex:1,
            editor: {
                xtype: 'textfield',
            }

        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'state',
            text: 'State',
            id: 'stateColumn',
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
                        {"id":"9", "name":"Active"},
                        {"id":"10", "name":"Dropped"},
                        {"id":"11", "name":"Incomplete"}
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

