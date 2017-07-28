Ext.define('MobileJudge.view.authentication.SignUp', {
	extend: 'MobileJudge.view.authentication.Dialog',
	xtype: 'signup',

	layout: {
		type: 'vbox',
		align: 'stretch'
	},

	defaultButton: 'submitButton',
	autoComplete: true,
	defaults: {
		margin: '10 0',
		selectOnFocus: true,
		hideLabel: true,
		allowBlank: false,
		cls: 'auth-textbox',
		height: 55
	},
	items: [
		{
			xtype: 'label',
			cls: 'lock-screen-top-label',
			text: 'Create an account',
			height: 10
		},
		{
			xtype: 'textfield',
			bind: '{salutation}',
			emptyText: 'Salutation: Mr, Mrs, Dr ...',
			triggers: {
				glyphed: {
					cls: 'trigger-glyph-noop auth-title-trigger'
				}
			},
			allowBlank:true
		},
		{
			xtype: 'textfield',
			emptyText: 'Full Name: John Smith',
			bind: '{userName}',
			triggers: {
				glyphed: {
					cls: 'trigger-glyph-noop auth-email-trigger'
				}
			}
		},
        {
            xtype: 'textfield',
            bind: '{title}',
            emptyText: 'Title: CEO, President, Student ...',
            triggers: {
                glyphed: {
                    cls: 'trigger-glyph-noop auth-title-trigger'
                }
            },
            allowBlank:true
        },
		{
			xtype: 'textfield',
			bind: '{affiliation}',
			emptyText: 'Organization: FIU, IBM, Google ...',
			triggers: {
				glyphed: {
					cls: 'trigger-glyph-noop auth-affiliation-trigger'
				}
			},
            allowBlank:true
		},
		{
			xtype: 'textfield',
			name: 'email',
			emptyText: 'Email: user@example.com',
			bind: '{email}',
			triggers: {
				glyphed: {
					cls: 'trigger-glyph-noop auth-envelope-trigger'
				}
			}
		},
		{
			xtype: 'textfield',
			emptyText: 'Password: Remember this password!',
			name: 'password',
			inputType: 'password',
			bind: '{password}',
			triggers: {
				glyphed: {
					cls: 'trigger-glyph-noop auth-password-trigger'
				}
			},
			id:'firstPass'
		},
        {
            xtype: 'textfield',
            emptyText: 'Confirm Password: Input same password!',
            name: 'password',
            inputType: 'password',
            triggers: {
                glyphed: {
                    cls: 'trigger-glyph-noop auth-password-trigger'
                }
            },
            initialPassField: 'firstPass',
            vtype: 'password'
        },
		{
			xtype: 'button',
			scale: 'large',
			ui: 'soft-blue',
			reference: 'submitButton',
			margin: '5 0',
			iconAlign: 'right',
			iconCls: 'x-fa fa-angle-right',
			text: 'Signup',
			bind: false,
			formBind: true,
			handler: 'onSetPageTwo'
		},
		{
			xtype: 'box',
			height: 10,
			html: '<div class="outer-div"><div class="seperator">Link your social accounts</div></div>'
		},
		{
			xtype: 'container',
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			cls: 'social-login',
			defaultType: 'button',
			defaults: {
				scale: 'large',
				width: 60
			},
			items: [
				{
					ui: 'fiu',
					reference: 'linkfiu',
					userCls: 'btn-oauth',
					preventDefault: false
				},
				{
					xtype: 'box',
					width: 1,
					html: '<div class="outer-div"><div class="seperator"></div></div>',
					margin: '0 8'
				},
				{
					ui: 'google',
					reference: 'linkgoogle',
					userCls: 'btn-oauth',
					iconCls: 'x-fa fa-google-plus',
					preventDefault: false
				},
				{
					xtype: 'box',
					width: 1,
					html: '<div class="outer-div"><div class="seperator"></div></div>',
					margin: '0 8'
				},
				{
					ui: 'linkedin2',
					reference: 'linklinkedin2',
					userCls: 'btn-oauth',
					iconCls: 'x-fa fa-linkedin',
					preventDefault: false
				},
				{
					xtype: 'box',
					width: 1,
					html: '<div class="outer-div"><div class="seperator"></div></div>',
					margin: '0 8'
				},
				{
					ui: 'facebook',
					reference: 'linkfacebook',
					userCls: 'btn-oauth',
					iconCls: 'x-fa fa-facebook',
					preventDefault: false
				},
				{
					xtype: 'box',
					width: 1,
					html: '<div class="outer-div"><div class="seperator"></div></div>',
					margin: '0 8'
				},
				{
					ui: 'twitter',
					reference: 'linktwitter',
					userCls: 'btn-oauth',
					iconCls: 'x-fa fa-twitter',
					preventDefault: false
				}
			]
		}
		/*{
		 xtype: 'component',
		 html: '<div style="text-align:right">' +
		 '<a href="#login" class="link-forgot-password">' +
		 'Back to Log In</a>' +
		 '</div>'
		 }*/
	],
    initComponent: function () {
        Ext.apply(Ext.form.field.VTypes, {
            password: function(val, field) {
                if (field.initialPassField) {
                    var pwd = field.up('form').down('#' + field.initialPassField);
                    return (val == pwd.getValue());
                }
                return true;
            },

            passwordText: 'Passwords do not match'
        });
        this.callParent();
    }
});
