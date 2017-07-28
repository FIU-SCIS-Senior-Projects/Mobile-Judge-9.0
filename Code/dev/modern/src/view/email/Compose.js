Ext.define('MobileJudge.view.email.Compose', {
	extend: 'Ext.form.Panel',
	xtype: 'compose',
	cls: 'email-compose',

	requires: [
		'Ext.Button',
		'Ext.field.Email'
	],

	layout: 'vbox',
	padding: 20,

	title: 'Compose',
	scrollable: 'y',

	tools: [
		{
			iconCls: 'x-fa fa-trash-o',
			handler: 'onCloseMessage'
		},{},
		{
			iconCls: 'x-fa fa-send',
			handler: 'onSendMessage'
		}
	],

	items: [
		{
			xtype: 'emailfield',
			name: 'email',
			placeHolder: 'user@example.com',
			bind: '{toField}',
			margin: '0 0 20 0'
		},
		{
			xtype: 'selectfieldplus',
			store: 'templates',
			placeHolder: 'Select a Template',
			displayField: 'name',
			valueField: 'id',
			value: ' ',
			bind: {
				value: '{template}'
			},
			listeners: {
				change: "onTemplateChange"
			},
			margin: '0 0 20 0'
		},
		{
			xtype: 'component',
			cls: 'rounded',
			html: 'Subject',
			bind: {
				html: '{preview.subject}'
			},
			margin: '0 0 20 0'
		},
		{
			xtype: 'component',
			cls: 'bodyTemplate rounded',
			styleHtmlContent: true,
			html: 'Email Content',
			bind: {
				html: '<div class="bodyWrapper"><iframe id="previewFrame" frameborder="0" src="{previewMobile}"></iframe></div>'
			},
			margin: '0 0 10 0'
		}
		/*{
			xtype: 'container',
			layout: 'hbox',
			height: 40,
			userCls: 'compose-email-tool',

			items: [
				{
					xtype: 'component',
					flex: 1
				},
				{
					xtype: 'button',
					ui: 'header',
					iconCls: 'x-fa fa-floppy-o'
				},
				{
					xtype: 'button',
					ui: 'header',
					padding: '0 12',
					iconCls: 'x-fa fa-paperclip'
				},
				{
					xtype: 'button',
					ui: 'header',
					padding: '0 12',
					iconCls: 'x-fa fa-trash',
					handler: 'onCloseMessage'
				}
			]
		}*/
	]
});
