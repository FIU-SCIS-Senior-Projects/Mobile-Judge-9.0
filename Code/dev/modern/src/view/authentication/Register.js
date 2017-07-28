Ext.define('MobileJudge.view.authentication.Register', {
	extend: 'MobileJudge.view.authentication.AuthBase',
	xtype: 'register',

	requires: [
		'Ext.field.Checkbox',
		'Ext.field.Password',
		'Ext.field.Text',
		'Ext.field.Email',
		'Ext.layout.HBox',
		'Ext.form.Panel',
		'Ext.dataview.List',
		'Ext.dataview.IndexBar'
	],

	viewModel: {
		type: 'registration'
	},

	listeners: {
		painted: 'onRegisterRender'
	},

	layout: 'card',
	reference: 'regWizard',
	//activeItem: 2,

	defaultType: 'panel',
	defaults: {
		scrollable: 'y'
	},

	items: [
		{
			items: [
				{
					padding: '10 0 0 10',
					html: 'Create an Account'
				},
				{
					xtype: 'panel',
					padding: '10 20',
					defaults: {
						margin: '0 0 10 0',
						allowBlank: false
					},
					items: [
						{
							xtype: 'textfield',
							bind: '{title}',
							placeHolder: 'Title'
						},
						{
							xtype: 'textfield',
							bind: '{userName}',
							placeHolder: 'Full Name',
							userCls: 'text-border'
						},
						{
							xtype: 'textfield',
							bind: '{affiliation}',
							placeHolder: 'Affiliation',
							userCls: 'text-border'
						},
						{
							xtype: 'emailfield',
							bind: '{email}',
							vtype: 'email',
							placeHolder: 'user@example.com',
							userCls: 'text-border'
						},
						{
							xtype: 'passwordfield',
							placeHolder: 'Password',
							bind: '{password}',
							userCls: 'text-border'
						},
						{
							xtype: 'button',
							text: 'Signup',
							iconAlign: 'right',
							iconCls: 'x-fa fa-angle-right',
							ui: 'confirm',
							handler: 'onSetPageTwo',
							bind: {
								disabled: '{!isValid}'
							}
						}
					]
				}
			]
		},
		{
			items: [
				{
					padding: '10 0 0 10',
					html: 'Optionaly link your account with us'
				},
				{
					xtype: 'container',
					padding: '10 20',
					defaults: {
						margin: '0 0 10 0'
					},
					items: [
						{
							xtype: 'button',
							reference: 'linkfiu',
							text: 'Link with FIU',
							iconAlign: 'right',
							iconCls: 'fiu',
							userCls: 'btn-oauth',
							ui: 'fiu'
						},
						{
							xtype: 'button',
							reference: 'linkgoogle',
							text: 'Link with Google',
							iconAlign: 'right',
							iconCls: 'x-fa fa-google-plus',
							userCls: 'btn-oauth',
							ui: 'google'
						},
						{
							xtype: 'button',
							reference: 'linklinkedin2',
							text: 'Link with LinkedIn',
							iconAlign: 'right',
							iconCls: 'x-fa fa-linkedin',
							userCls: 'btn-oauth',
							ui: 'linkedin2'
						},
						{
							xtype: 'button',
							reference: 'linkfacebook',
							text: 'Link with Facebook',
							iconAlign: 'right',
							iconCls: 'x-fa fa-facebook',
							userCls: 'btn-oauth',
							ui: 'facebook'
						},
						{
							xtype: 'button',
							reference: 'linktwitter',
							text: 'Link with Twitter',
							iconAlign: 'right',
							iconCls: 'x-fa fa-twitter',
							userCls: 'btn-oauth',
							ui: 'twitter'
						}
					]
				},
				{
					xtype: 'container',
					layout: 'hbox',
					margin: '0 0 10 0',
					items: [
						{
							html: '<div></div>',
							flex: 1
						},
						{
							xtype: 'button',
							ui: 'soft-blue',
							iconCls: 'x-fa fa-angle-left',
							text: 'Back',
							handler: 'onSetPageOne'
						},
						{
							html: '<div></div>',
							flex: 1
						},
						{
							xtype: 'button',
							ui: 'soft-green',
							iconAlign: 'right',
							iconCls: 'x-fa fa-angle-right',
							text: 'Next',
							handler: 'onSetPageThree'
						},
						{
							html: '<div></div>',
							flex: 1
						}
					]
				}
			]
		},
		{
			layout: 'vbox',
			items: [
				{
					padding: '10 0 0 10',
					html: 'Select Conflicts'
				},
				{
					margin: '0 10',
					xtype: 'list',
					reference: 'gridConflicts',
					cls: 'conflictSelector',
					flex: 1,
					grouped: true,
					indexBar: true,
					mode: 'SIMPLE',
					bind: {
						store: '{conflicts}'
					},
					itemTpl:
					'<div class="search-user-item">' +
						'<div class="search-user-image">' +
							'<img src="{profileImgUrl}" class="circular" width="50" height="50"/>' +
						'</div>' +
						'<div class="search-user-content">' +
							'<div class="search-user-title">{fullName}</div>' +
							'<div class="search-user-email">{project}</div>' +
							//'<div class="search-user-date">{location}</div>'
						'</div>' +
					'</div>'
				},
				{
					xtype: 'container',
					margin: '5 0 10 0',
					layout: 'hbox',
					items: [
						{
							html: '<div></div>',
							flex: 1
						},
						{
							xtype: 'button',
							ui: 'soft-blue',
							iconCls: 'x-fa fa-angle-left',
							text: 'Back',
							handler: 'onSetPageTwo'
						},
						{
							html: '<div></div>',
							flex: 1
						},
						{
							xtype: 'button',
							ui: 'soft-green',
							iconAlign: 'right',
							iconCls: 'x-fa fa-flag-checkered',
							text: 'Done',
							handler: 'onDoneRegister'
						},
						{
							html: '<div></div>',
							flex: 1
						}
					]
				}
			]
		}
	]

});
