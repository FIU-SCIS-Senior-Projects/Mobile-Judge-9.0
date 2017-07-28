Ext.define('MobileJudge.view.authentication.PasswordChange', {
	extend: 'MobileJudge.view.authentication.LockingWindow',
	xtype: 'passwordchange',

	requires: [
		'Ext.form.Label',
		'Ext.form.field.Text',
		'Ext.button.Button'
	],

	//title: 'Change Password',

	defaultFocus: 'authdialog',  // Focus the Auth Form to force field focus as well

	items: [
		{
			xtype: 'authdialog',
			width: 455,
			defaultButton: 'changePasswordBtn',
			bodyPadding: '20 20',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},

			defaults: {
				margin: '10 0'
			},

			cls: 'lock-screen-password-textbox',
			items: [
				{
					xtype: 'label',
					cls: 'lock-screen-top-label',
					text: 'Please choose a new password for your account'
				},
				/*{
					xtype: 'textfield',
					cls: 'auth-textbox',
					height: 55,
					inputType: 'password',
					allowBlank: false,
					hideLabel: true,
					triggers: {
						glyphed: {
							cls: 'trigger-glyph-noop password-trigger'
						}
					},

					hidden: true,
					emptyText: 'Old Password',
					reference: 'oldPassword',
					name: 'password',
					bind: '{oldPassword}'
				},*/
				{
					xtype: 'textfield',
					cls: 'auth-textbox',
					height: 55,
					inputType: 'password',
					allowBlank: false,
					hideLabel: true,
					triggers: {
						glyphed: {
							cls: 'trigger-glyph-noop password-trigger'
						}
					},

					emptyText: 'New Password',
					name: 'newPassword',
					bind: '{newPassword}',
					id: 'newPassword'
				},
				{
					xtype: 'textfield',
					cls: 'auth-textbox',
					height: 55,
					inputType: 'password',
					allowBlank: false,
					hideLabel: true,
					triggers: {
						glyphed: {
							cls: 'trigger-glyph-noop password-trigger'
						}
					},

					emptyText: 'Confirm New Password',
					initialPassField: 'newPassword',
					name: 'confirmPassword',
					bind: '{confirmPassword}',
					vtype: 'password'
				},
				{
					xtype: 'button',
					reference: 'changePasswordBtn',
					scale: 'large',
					ui: 'soft-blue',
					formBind: true,
					iconAlign: 'right',
					iconCls: 'x-fa fa-angle-right',
					text: 'Change Password',
					handler: 'onChangePassword'
				}/*,
				{
					xtype: 'component',
					reference: 'backToHome',
					hidden: true,
					html: '<div style="text-align:right">' +
					'<a href="#login" class="link-forgot-password">' +
						'Back to Home Page</a>' +
					'</div>'
				}*/
			]
		}
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
