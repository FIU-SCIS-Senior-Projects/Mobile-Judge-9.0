Ext.define('MobileJudge.view.authentication.LockScreen', {
    extend: 'MobileJudge.view.authentication.AuthBase',
    xtype: 'lockscreen',

    requires: [
        'Ext.field.Text'
    ],

    padding:20,

    items: [{
        xtype: 'panel',

        items: [{
            xtype: 'container',
            userCls: 'lockscreen-header',
            padding:20,

            layout: 'hbox',
            items: [{
                xtype: 'img',
                height: 64,
                width: 64,
                userCls: 'circular',
                bind: {
                    src: '{profilePic}'
                }
            },{
                xtype: 'container',
                bind: {
                    html: '<b>{userName}</b><br>{title}'
                },
                padding:15
            }]
        },{
            padding:'20 20 0 20',
            html: 'It\'s been awhile.  Please enter your password to resume'
        },{
            xtype: 'container',
            padding: 20,
            defaults: {
                margin:'0 0 10 0'
            },
            items: [{
                xtype: 'passwordfield',
                placeHolder: 'Password',
                userCls: 'text-border',
	            bind: '{password}'
            },{
                xtype: 'button',
                text: 'Login',
                iconAlign: 'right',
                iconCls: 'x-fa fa-angle-right',
                ui: 'gray-button',
	            handler: 'onLoginButton'
            },{
                html: '<a href="#login">Sign in using a different account</a>'
            }]
        }]

    }]
});
