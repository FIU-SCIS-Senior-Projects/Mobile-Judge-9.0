Ext.define('MobileJudge.view.email.Details', {
	extend: 'Ext.form.Panel',
	xtype: 'emaildetails',

	requires: [
		'Ext.container.Container',
		'Ext.layout.container.Anchor',
		'Ext.layout.container.HBox'
	],

	cls: 'shadow',

	bodyPadding: 10,

	layout: {
		type: 'anchor',
		anchor: '100%'
	},

	listeners: {
		beforerender: 'beforeDetailsRender'
	},

	tbar: [
		// Default item type for toolbar is button, thus we can skip it's definition in
		// the array items
		{
			iconCls: 'x-fa fa-angle-left',
			tooltip: 'Back',
			listeners: {
				click: 'onBackBtnClick'
			}
		}/*,
		 {
			 iconCls: 'x-fa fa-mail-forward',
			 listeners: {
			    click: 'onResendBtnClick'
			 }
		 }*/
	],

	bbar: {
		cls: 'single-mail-action-button',
		defaults: {
			margin: '0 15 0 0'
		},
		items: [
			'->',
			{
				ui: 'gray',
				text: 'Back',
				listeners: {
					click: 'onBackBtnClick'
				}
			}/*,
			 {
				 ui: 'soft-green',
				 text: 'Resend',
				 listeners: {
				    click: 'onResendBtnClick'
				 }
			 }*/
		]
	},

	items: [
		{
			xtype: 'container',
			height: 82,
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'image',
					itemId: 'userImage',
					cls: 'email-sender-img',
					alt: 'profileImage',
					height: 80,
					width: 80
				},
				{
					xtype: 'component',
					flex: 1,
					cls: 'single-mail-email-subject',
					data: {},
					itemId: 'emailSubjectContainer',
					padding: 10,
					tpl: [
						'<div class="user-name">{fullName}</div>',
						'<div class="user-info">{subject}</div>'
					]
				}
			]
		},
		{
			xtype: 'box',
			cls: 'mail-body',
			itemId: 'mailBody'
		}
	]
});
