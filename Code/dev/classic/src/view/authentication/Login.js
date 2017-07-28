Ext.define('MobileJudge.view.authentication.Login', {
	extend: 'MobileJudge.view.authentication.LockingWindow',
	xtype: 'login',

	requires: [
		'Ext.container.Container',
		'Ext.form.field.Text',
		'Ext.form.field.Checkbox',
		'Ext.button.Button'
	],

	defaultFocus: 'authdialog', // Focus the Auth Form to force field focus as well

	listeners: {
		afterrender: 'onLoginRender'
	},

	items: [
		{
			xtype: 'authdialog',
			defaultButton: 'loginButton',
			autoComplete: true,
			bodyPadding: '20 20',
			cls: 'auth-dialog-login',
			header: false,
			width: 415,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},

			defaults: {
				margin: '5 0'
			},

			items: [
				{
					xtype: 'label',
					text: 'Sign into your account'
				},
				{
					xtype: 'textfield',
					cls: 'auth-textbox',
					height: 55,
					hideLabel: true,
					allowBlank: false,
					name: 'email',
					emptyText: 'user@example.com',
					vtype: 'email',
					bind: '{email}',
					triggers: {
						glyphed: {
							cls: 'trigger-glyph-noop auth-envelope-trigger'
						}
					}
				},
				{
					xtype: 'textfield',
					cls: 'auth-textbox',
					height: 55,
					hideLabel: true,
					emptyText: 'Password',
					inputType: 'password',
					name: 'password',
					bind: '{password}',
					allowBlank: false,
					triggers: {
						glyphed: {
							cls: 'trigger-glyph-noop auth-password-trigger'
						}
					}
				},
				{
					xtype: 'container',
					layout: 'hbox',
					items: [
						{
							xtype: 'checkboxfield',
							flex: 1,
							cls: 'form-panel-font-color rememberMeCheckbox',
							height: 30,
							bind: '{persist}',
							boxLabel: 'Remember me'
						},
						{
							xtype: 'box',
							html: '<a href="#passwordreset" class="link-forgot-password"> Forgot Password ?</a>'
						}
					]
				},
				{
					xtype: 'button',
					reference: 'loginButton',
					scale: 'large',
					ui: 'soft-green',
					iconAlign: 'right',
					iconCls: 'x-fa fa-angle-right',
					text: 'Login',
					formBind: true,
					handler: 'onLoginButton'
				},
				{
					xtype: 'box',
					html: '<div class="outer-div"><div class="seperator">OR</div></div>',
					margin: '10 0'
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
							userCls: 'btn-oauth',
							tooltip: 'Login with FIU Account',
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
							userCls: 'btn-oauth',
							iconCls: 'x-fa fa-google-plus',
							tooltip: 'Login with Google',
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
							userCls: 'btn-oauth',
							iconCls: 'x-fa fa-linkedin',
							tooltip: 'Login with LinkedIn',
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
							userCls: 'btn-oauth',
							iconCls: 'x-fa fa-facebook',
							tooltip: 'Login with Facebook',
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
							userCls: 'btn-oauth',
							iconCls: 'x-fa fa-twitter',
							tooltip: 'Login with Twitter',
							preventDefault: false
						}
					]
				}
			]
		}
	]
});
