Ext.define('MobileJudge.view.grade.Wizard', {
    extend: 'Ext.window.Window',
    alias: 'widget.acceptgradewizard',
    requires: [
        'Ext.button.Button',
        'Ext.form.field.Radio',
        'Ext.form.*',
        'Ext.layout.container.Accordion',
        'Ext.layout.container.Card',
        'Ext.Component'
    ],

    bodyPadding: 10,
    scrollable: true,
    controller: 'grade',
    modal : true,
    listeners: {
        close: function(){
            var ctrl = this.getController();
            var grades = Ext.getStore("judgeGrades").data.items;
            ctrl.loadSecondViewData(grades[0].data);
        }
    },

    width: 800,
    height: 600,
    title: 'Student Grade by a Judge',
    initComponent: function() {
        this.callParent(arguments);
    },

    loadData: function(record){
        var ctrl = this.getController();
        $("#judgeThirdLabel").text(record.data.judgeName);
        $("#studentThirdLabel").text(record.data.fullName);
        $("#projectThirdLabel").text(record.data.project);
        $("#gradeThirdLabel").text(record.data.gradeAverage);
        ctrl.loadThirdViewData(record.data);
    },

    tbar: {
        items: [
            {
                xtype: 'panel',
                width: 375,
                items: [
                    {
                        items: [
                            {
                                xtype: 'label',
                                text: 'Judge:',
                                readOnly : true
                            },
                            {
                                id: 'judgeThirdLabel',
                                xtype: 'label',
                                text: '',
                                readOnly : true,
                                style:'padding:0px 0px 0px 30px'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'label',
                                text: 'Student:',
                                readOnly : true
                            },
                            {
                                id: 'studentThirdLabel',
                                xtype: 'label',
                                text: '',
                                readOnly : true,
                                style:'padding:0px 0px 0px 22px'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'label',
                                text: 'Project:',
                                readOnly : true
                            },
                            {
                                id: 'projectThirdLabel',
                                xtype: 'label',
                                text: '',
                                readOnly : true,
                                style:'padding:0px 0px 0px 23px'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'label',
                                text: 'Grade:',
                                readOnly : true
                            },
                            {
                                id: 'gradeThirdLabel',
                                xtype: 'label',
                                text: '',
                                readOnly : true,
                                style:'padding:0px 0px 0px 28px'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'detailAllThirdButton',
                xtype: 'image',
                src: '/resources/images/icons/RedYellowGreen.ico',
                width: 40,
                dataIndex: 'bool',
                sortable: false,
                hideable: false,
                listeners: {
                    el: {
                        click: 'globalThirdViewStatus'
                    }
                },
                tooltip: '',
                layout: {
                    align: 'right'
                }
            }
        ],
        renderTo: Ext.getBody()
    },

    items: [
        {
            xtype: 'acceptGrade'
        }
    ]
});

Ext.define('MobileJudge.view.grade.acceptGrade', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.acceptGrade',
    store: 'judgeGrades',
    requires: [
        'Ext.grid.column.Action',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.toolbar.Toolbar'
    ],
    initComponent: function() {
        this.callParent()
    },
    columns: [
        {
            xtype: 'gridcolumn',
            text: 'Question',
            dataIndex: 'question',
            width:315,
        },{
            xtype: 'gridcolumn',
            text: 'Grade',
            dataIndex: 'grade',
            width: 72,

            clearOnReset: true,
        },{
            xtype: 'gridcolumn',
            text: 'Comment',
            dataIndex: 'comment',
            width:336,


        },
        {
            xtype: 'actioncolumn',
            text: 'Status',
            items: [
                {
                    icon: '/resources/images/icons/Green.ico',
                    tooltip: 'Status',
                    handler: 'changeStatusThirdView'
                }
            ],
            renderer: function (value, metadata, record) {
                if(record.get('accepted') != null){
                    if (record.get('accepted').toLowerCase() == "pending") {
                        this.items[0].tooltip = 'Pending';
                        this.items[0].icon = '/resources/images/icons/Yellow.ico';
                    }else if (record.get('accepted').toLowerCase() == "accepted") {
                        this.items[0].tooltip = 'Accepted';
                        this.items[0].icon = '/resources/images/icons/Green.ico';
                    } else {
                        this.items[0].tooltip = 'Rejected';
                        this.items[0].icon = '/resources/images/icons/Red.ico';
                    }
                }
            },
            width: 77,
            dataIndex: 'bool',
            sortable: false,
            hideable: false
        }],
    floating: false,
    draggable: false,
    modal: true,
    closable: false,
    scrollable: false,
    renderTo: Ext.get('acceptgrademodal')
});

Ext.create('Ext.data.Store', {
    storeId:'judgeGrades',
    fields:['question', 'comment', 'grade'],
    data:{'items':[
        { 'question': 'First Question',  "comment":"This is great comment is not too long",  "grade":9},
        { 'question': 'Second Question',  "comment":"This is great comment is not too long",  "grade":9},
        { 'question': 'Thids Question',  "comment":"This is great comment is not too long",  "grade":9},
        { 'question': 'Fourth Question',  "comment":"This is great",  "grade":9},
        { 'question': 'Fifth Question',  "comment":"This is great",  "grade":9}
    ]},
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});