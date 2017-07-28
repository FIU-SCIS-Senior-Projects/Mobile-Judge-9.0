Ext.define('MobileJudge.view.email.Wizard', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.emailwizard',
    requires: [
        'Ext.button.Button',
	    'Ext.layout.container.Accordion',
	    'Ext.layout.container.Card'
    ],

    cls: 'wizardone',
	userCls: 'big-50 small-100',

	layout: 'card',

	bodyPadding: 10,
	scrollable: true,

	defaults : {
		/*
		 * Seek out the first enabled, focusable, empty textfield when the form is focused
		 */
		defaultFocus: 'textfield:not([value]):focusable:not([disabled])',
		defaultButton : 'nextbutton'
	},

	items: [
		{
			xtype: 'selectemails'
		},
		{
			xtype: 'refineselection'
		},
		{
			xtype: 'templatepreview'
		}
	],

	tbar: {
		reference: 'progress',
		cls: 'wizardprogressbar',
		defaults: {
			disabled: true,
			iconAlign:'top'
		},
		layout: {
			pack: 'center'
		},
		items: [
			{
				step: 0,
				ui: 'wizard-blue',
				iconCls: 'fa fa-users',
				pressed: true,
				enableToggle: true,
				text: 'Select Lists'
			},
			{
				step: 1,
				ui: 'wizard-blue',
				iconCls: 'fa fa-user-times',
				enableToggle: true,
				text: 'Refine Selection'
			},
			{
				step: 2,
				ui: 'wizard-blue',
				iconCls: 'fa fa-heart',
				enableToggle: true,
				text: 'Template & Preview'
			}
		]
	},

	bbar: {
		reference: 'navigation-toolbar',
		margin: 8,
		items: [
			'->',
			{
				text: 'Previous',
				ui: 'blue',
				formBind: true,
				bind: {
					disabled: '{atStart}'
				},
				listeners: {
					click: 'onPreviousClick'
				}
			},
			{
				ui: 'blue',
				formBind: true,
				reference : 'nextbutton',
				bind: {
					text: '{caption}',
					disabled: '{!canMoveNext}'
				},
				listeners: {
					click: 'onNextClick'
				}
			}
		]
	}
});
