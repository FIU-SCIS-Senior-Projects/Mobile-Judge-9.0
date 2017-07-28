Ext.define('MobileJudge.view.authentication.Register', {
	extend: 'MobileJudge.view.authentication.LockingWindow',
	xtype: 'register',

	requires: [
		'Ext.view.View',
		'Ext.button.Button',
		'Ext.form.Label',
		'Ext.form.field.Checkbox',
		'Ext.form.field.Text'
	],

	scrollable: true,

	title: 'Welcome Prospertive Judge',
	defaultFocus: 'authdialog',  // Focus the Auth Form to force field focus as well

	viewModel: {
		type: 'registration'
	},

	listeners: {
		afterrender: 'onRegisterRender'
	},

	items: [
		{
			xtype: 'container',
			layout: 'card',
			reference: 'regWizard',
			defaults: {
				bodyPadding: '20 20',
				cls: 'auth-dialog-register',
				width: 415,
				height: 800
			},
			items: [
				{
					xtype: 'signup',
					reference: 'authDialog'
				},
				{
					xtype: 'form',
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					bbar: {
						items: [
							'->',
							{
								ui: 'soft-blue',
								iconCls: 'x-fa fa-angle-left',
								text: 'Back',
								handler: 'onSetPageOne'
							},
							'->',
							{
								ui: 'soft-green',
								iconAlign: 'right',
								iconCls: 'x-fa fa-angle-right',
								text: 'Done',
								handler: 'onDoneRegister'
							},
							'->'
						]
					},
					items: [
						{
							xtype: 'label',
							cls: 'lock-screen-top-label',
							text: 'Please select any of the following students whom ' +
                            'you may have a conflict of interests with. For example: colleagues, relatives, friends, etc.',
							height: 55
						},
						{
							xtype: 'box',
							height: 10,
							userCls: 'auth-dialog',
							html: '<div class="outer-div"><div class="seperator"></div></div>'
						},
						{
							xtype: 'container',
							flex: 1,
							scrollable: 'y',
							items: [
								{
									xtype: 'dataview',
									reference: 'gridConflicts',
									cls: 'conflictSelector',
									loadMask: false,
									trackOver: false,
									itemSelector: '.conflictSelector .search-user-item',
									selectedItemCls: 'selected',
									selectionModel: {
										type: 'dataviewmodel',
										mode: 'SIMPLE'
									},
									tpl: [
										'<tpl for=".">',
											'<div class="search-user-item">',
												'<div class="search-user-image">',
													'<img src="{profileImgUrl}" class="circular" width="50" height="50"/>',
												'</div>',
												'<div class="search-user-content">',
													'<div class="search-user-title">{fullName}</div>',
													'<div class="search-user-email">{project}</div>',
													//'<div class="search-user-date">{location}</div>',
												'</div>',
											'</div>',
										'</tpl>'
									],
									bind: {
										store: '{conflicts}'
									}
								}
							]
						}
					]
				}
			]
		}
	]
});
