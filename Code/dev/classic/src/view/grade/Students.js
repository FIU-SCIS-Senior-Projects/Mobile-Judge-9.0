Ext.define('MobileJudge.view.grade.Students', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gradestudents',

    requires: [
        'Ext.grid.column.Action',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.toolbar.Toolbar'
    ],
    listeners: {
        afterrender: 'changeIcon',
        painted: 'changeIcon',
        cellclick: function (iView, iCellEl, iColIdx, iStore, iRowEl, iRowIdx, iEvent) {
            var data = Ext.getStore("studentgradesview").data.items[iRowIdx];

            if (iColIdx < 6)
                Ext.widget('gradestudentdetailwizard').show().loadData(data);
        }
    },

    bind: '{studentgradesview}',
    references: 'gridStudents',
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    xtype: 'dataview',
                    cls: 'stateSelector',
                    loadMask: false,
                    trackOver: false,
                    itemSelector: '.stateSelector button',
                    selectedItemCls: 'selected',
                    selectionModel: {
                        type: 'dataviewmodel',
                        storeId: 'studentgradesview',
                        mode: 'SIMPLE'
                    },
                    tpl: [
                        '<tpl>',
                        '<button type="button" title="AcceptedGrades" id="AcceptedGrades">AC</button>',
                        '<button type="button" title="PendingGrades"  id="PendingGrades">PE</button>',
                        '<button type="button" title="RejectedGrades" id="RejectedGrades">RJ</button>',
                        '</tpl>'
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
                        store: '{studentgradesview}'
                    },
                    listeners:{
                        change: 'changeIcon'
                    }

                },
                '->',
                {
                    ui: 'soft-blue',
                    glyph: '',
                    iconCls: 'x-fa fa-cloud-download',
                    text: 'Download Grades',
                    handler: 'onExportGradeReport'
                },
                '->',
                {
                    id: 'topIcon',
                    xtype: 'image',
                    alt:'StatusIndicator',
                    src: '/resources/images/icons/RedYellowGreen.ico',
                    width: 40,
                    dataIndex: 'bool',
                    sortable: false,
                    hideable: false,
                    listeners: {
                        el: {
                            click: 'statusManager'
                        }
                    },
                    tooltip: '',
                }
            ]
        },
    ],
    columns: [
        {
            xtype: 'gridcolumn',
            width: 75,
            dataIndex: 'studentId',
            id:'studentIdxColumn',
            hideable: false,
            text: '',

        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'fullName',
            id:'studentNameColumn',
            text: 'Name',
            flex: 1,

        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'email',
            id:'studentEmailColumn',
            text: 'Email',
            flex: 1,

        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'project',
            id:'studentProjColumn',
            text: 'Project',
            flex: 2,
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'grade',
            text: 'Accepted Grade',
            id:'studentAgColumn',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'rawGrade',
            id:'studentRgColumn',
            text: 'Raw Grade',
            flex: 1
        },
        {
            id: 'status',
            xtype: 'actioncolumn',
            text: 'Status',
            flex: 1,
            items: [
                {
                    icon: '/resources/images/icons/Yellow.ico',
                    tooltip: 'Status',
                    handler: 'onStateChange'
                }
            ],
            renderer: function (value, metadata, record) {
                var green = false;
                var red = false;
                var yellow = false;

                var ctlr = this.up().up().up().getController();
                ctlr.changeIcon();

                if (record.get('pending') == true) {
                    this.items[0].tooltip = 'Pending';
                    this.items[0].icon = '/resources/images/icons/Yellow.ico';
                    yellow = true;
                }
                if (record.get('accepted') == true) {
                    this.items[0].tooltip = 'Accepted';
                    this.items[0].icon = '/resources/images/icons/Green.ico';
                    green = true;
                }
                if(record.get('rejected') == true){
                    this.items[0].tooltip = 'Rejected';
                    this.items[0].icon = '/resources/images/icons/Red.ico';
                    red = true;
                }

                if (green && red && yellow) {
                    this.items[0].tooltip = 'Accepted|Pending|Rejected';
                    this.items[0].icon = '/resources/images/icons/RedYellowGreen.ico';
                }else if(green && red) {
                    this.items[0].tooltip = 'Accepted|Rejected';
                    this.items[0].icon = '/resources/images/icons/RedGreen.ico';
                }else if(green && yellow) {
                    this.items[0].tooltip = 'Accepted|Pending';
                    this.items[0].icon = '/resources/images/icons/YellowGreen.ico';
                }else if(yellow && red) {
                    this.items[0].tooltip = 'Pending|Rejected';
                    this.items[0].icon = '/resources/images/icons/RedYellow.ico';
                }
            },
            height: 32,
            width: 32,
            dataIndex: 'bool',
            sortable: false,
            hideable: false
        }
    ]
});
