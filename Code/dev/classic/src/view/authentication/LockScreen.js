Ext.define('MobileJudge.view.authentication.LockScreen', {
    extend: 'MobileJudge.view.authentication.LockingWindow',
    xtype: 'lockscreen',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.field.Text',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox'
    ],

    defaultFocus : 'authdialog',  // Focus the Auth Form to force field focus as well

    items: [
        {
            xtype: 'authdialog',
            reference: 'authDialog',
            defaultButton : 'loginButton',
            autoComplete: false,
            width: 455,
            cls: 'auth-dialog-login',
            defaultFocus : 'textfield[inputType=password]',
            layout: {
                type  : 'vbox',
                align : 'stretch'
            },

            items: [
                {
                    xtype: 'container',
                    cls: 'auth-profile-wrap',
                    height : 120,
                    layout: {
                        type: 'hbox',
                        align: 'center'
                    },
                    items: [
                        {
                            xtype: 'image',
                            height: 80,
                            margin: 20,
                            width: 80,
                            alt: 'lockscreen-image',
                            cls: 'lockscreen-profile-img auth-profile-img',
	                        bind: {
		                        src: '{profilePic}'
	                        }
                        },
                        {
                            xtype: 'box',
	                        bind: {
		                        html: '<div class="user-name-text">{userName}</div><div class="user-post-text">{title}</div>'
	                        }
                        }
                    ]
                },

                {
                    xtype: 'container',
	                cls: 'lock-screen-password-textbox',
                    padding: '0 20',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },

                    defaults: {
                        margin: '10 0'
                    },

                    items: [
                        {
                            xtype: 'textfield',
                            labelAlign: 'top',
                            //height: 55,
                            labelSeparator: '',
                            fieldLabel: 'It\'s been a while. please enter your password to resume',
                            emptyText: 'Password',
                            inputType: 'password',
	                        name: 'password',
	                        bind: '{password}',
                            allowBlank: false,
                            triggers: {
                                glyphed: {
                                    cls: 'trigger-glyph-noop password-trigger'
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            reference: 'loginButton',
                            scale: 'large',
                            ui: 'soft-blue',
                            iconAlign: 'right',
                            iconCls: 'x-fa fa-angle-right',
                            text: 'Login',
                            formBind: true,
                            handler: 'onLoginButton'
                        },
                        {
                            xtype: 'component',
                            html: '<div style="text-align:right">' +
                                '<a href="#login" class="link-forgot-password">'+
                                    'or, sign in using other credentials</a>' +
                                '</div>'
                        }
                    ]
                }
            ]
        }
    ]
});
