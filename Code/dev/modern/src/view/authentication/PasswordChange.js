Ext.define('MobileJudge.view.authentication.PasswordChange', {
	extend: 'MobileJudge.view.authentication.AuthBase',
	xtype: 'passwordchange',

	requires: [
		'Ext.field.Password'
	],

	items: [
		{
			xtype: 'panel',
			padding: 20,

			items: [
				{
					html: 'Choose a new Password',
					padding: '0 0 10 0'
				},
				{
					xtype: 'container',
					defaults: {
						margin: '0 0 10 0'
					},
					items: [
						{
							xtype: 'passwordfield',
							placeHolder: 'New Password',
							bind: '{newPassword}',
							userCls: 'text-border'
						},
						{
							xtype: 'passwordfield',
							placeHolder: 'Confirm Password',
							bind: '{confirmPassword}',
							userCls: 'text-border'
						},
						{
							xtype: 'button',
							iconAlign: 'right',
							iconCls: 'x-fa fa-angle-right',
							ui: 'action',
							text: 'Change Password',
							handler: 'onChangePassword'
						}/*,
						{
							html: '<a href="#login">Back to Login</a>'
						}*/
					]
				}
			]
		}
	]
});
