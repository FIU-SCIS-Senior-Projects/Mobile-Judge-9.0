Ext.define('MobileJudge.view.admin.Home', {
    extend: 'Ext.Container',
    xtype: 'adminhome',

    controller: 'charts',
    viewModel: {
        type: 'charts'
    },

    cls: 'dashboard',

    scrollable: true,

    defaultType: 'basepie',
    defaults: {
        iconCls: 'x-fa fa-pie-chart',
        userCls: 'big-33 small-100 dashboard-item shadow',
        height: 300
    },

    items: [
        {
            xtype:'chartjudges',
            userCls: 'big-100 small-100 dashboard-item shadow'
        },
        {
            title: 'Students',
            items: [
                {
                    xtype: 'smallpie',
                    bind: '{students}'
                }
            ]
        },
        {
            title: 'Graded',
            items: [
                {
                    xtype: 'smallpie',
                    bind: '{graded}'
                }
            ]
        },
        {
            title: 'Accepted',
            items: [
                {
                    xtype: 'smallpie',
                    bind: '{accepted}'
                }
            ]
        }
    ]
});
