Ext.define('MobileJudge.view.authentication.Login', {
	extend: 'MobileJudge.view.authentication.AuthBase',
	xtype: 'login',

	requires: [
		'Ext.field.Checkbox',
		'Ext.field.Password',
		'Ext.field.Email',
		'Ext.layout.HBox'
	],

	listeners: {
		painted: 'onLoginRender'
	},

	items: [
		{
			xtype: 'panel',
			items: [
				{
					padding: '20 0 0 20',
					html: 'Sign into your account'
				},
				{
					xtype: 'container',
					padding: 20,
					defaults: {
						margin: '0 0 10 0'
					},
					items: [
						{
							xtype: 'emailfield',
							placeHolder: 'Email',
							vtype: 'email',
							bind: '{email}',
							userCls: 'text-border'
						},
						{
							xtype: 'passwordfield',
							placeHolder: 'Password',
							bind: '{password}',
							userCls: 'text-border'
						},
						{
							layout: 'hbox',
							items: [
								{
									xtype: 'checkboxfield',
									bind: '{persist}'
								},
								{
									html: 'Remember Me',
									userCls: 'checkbox-text-adjustment',
									style: 'marginRight:20px'
								},
								{
									html: '<a href="#passwordreset">Forgot Password</a>',
									userCls: 'checkbox-text-adjustment'
								}
							]
						},
						{
							xtype: 'button',
							text: 'Login',
							iconAlign: 'right',
							iconCls: 'x-fa fa-angle-right',
							ui: 'confirm',
							handler: 'onLoginButton'
						},
						{
							xtype: 'button',
							text: 'Login with FIU',
							iconAlign: 'right',
							iconCls: 'fiu',
							userCls: 'btn-oauth',
							ui: 'fiu'
						},
						{
							xtype: 'button',
							text: 'Login with Google',
							iconAlign: 'right',
							iconCls: 'x-fa fa-google-plus',
							userCls: 'btn-oauth',
							ui: 'google'
						},
						{
							xtype: 'button',
							text: 'Login with LinkedIn',
							iconAlign: 'right',
							iconCls: 'x-fa fa-linkedin',
							userCls: 'btn-oauth',
							ui: 'linkedin2'
						},
						{
							xtype: 'button',
							text: 'Login with Facebook',
							iconAlign: 'right',
							iconCls: 'x-fa fa-facebook',
							userCls: 'btn-oauth',
							ui: 'facebook'
						},
						{
							xtype: 'button',
							text: 'Login with Twitter',
							iconAlign: 'right',
							iconCls: 'x-fa fa-twitter',
							userCls: 'btn-oauth',
							ui: 'twitter'
						}
					]
				}
			]
		}
	]
});
