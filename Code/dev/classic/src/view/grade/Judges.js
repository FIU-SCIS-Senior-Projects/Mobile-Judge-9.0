Ext.define('MobileJudge.view.grade.Judges', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gradejudges',

    requires: [
        'Ext.grid.plugin.RowEditing',
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
            var data = Ext.getStore("judgegradesview").data.items[iRowIdx];

            if (iColIdx < 3)
                Ext.widget('gradejudgedetailwizard').show().loadData(data);
        }
    },

    bind: '{judgegradesview}',

    dockedItems: [
        {
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            bind: '{judgegradesview}'
        },
    ],
    columns: [
        {
            xtype: 'gridcolumn',
            width: 75,
            dataIndex: 'judgeId',
            hideable: false,
            text: ''
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'fullName',
            text: 'Name',
            flex: 1,
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'email',
            text: 'Email',
            flex: 2,
        },
        {
            id: 'judgeStatus',
            xtype: 'actioncolumn',
            text: 'Status',
            flex: 1,
            items: [
                {
                    icon: '/resources/images/icons/Yellow.ico',
                    tooltip: 'Status',
                    handler: 'onJudgeStateChange'
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
