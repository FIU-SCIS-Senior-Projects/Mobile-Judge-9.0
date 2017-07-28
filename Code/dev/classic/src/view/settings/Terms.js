Ext.define('MobileJudge.view.settings.Terms', {
	extend: 'Ext.form.Panel',
	alias: 'widget.terms',

	requires: [
		'Ext.form.field.ComboBox',
		'Ext.form.field.Checkbox',
		'Ext.form.field.Date',
		'Ext.form.field.Number',
		'Ext.form.field.Text',
		'Ext.form.field.Time',
		'Ext.toolbar.Toolbar'
	],

	title: 'Terms',
	reference: 'termForm',
	iconCls: 'x-fa fa-calendar',
	cls: 'term-editor',

	layout: 'anchor',

	bodyPadding: 10,
	scrollable: true,

	modelValidation: true,

	defaultType: 'fieldcontainer',
	defaults: {
		anchor: '100%',
		layout: 'anchor',
		labelAlign: 'top',
		labelSeparator: '',
		userCls: 'groupFieldContainer',
		defaultType: 'textfield',
		defaults: {
			anchor: '100%',
			labelAlign: 'left',
			labelSeparator: '',
			labelWidth: 160
		}
	},

	tbar: [
		{
			xtype: 'combobox',
			reference: 'termSelector',
			fieldLabel: 'Select Term',
			emptyText: '-- Create New Term --',
			labelWidth: 80,
			queryMode: 'local',
			forceSelection: true,
			editable: false,
			displayField: 'name',
			valueField: 'id',
			flex: 1,
			bind: {
				store: '{terms}',
				disabled: '{status.canSave}'
			}
		},
		{
			ui: 'soft-blue',
			glyph:'',
			iconCls: 'x-fa fa-edit',
			text: 'New',
			bind: {
				disabled: '{!status.canCreate}'
			},
			handler: 'onNewTermClick'
		},
		{
			ui: 'soft-green',
			glyph:'',
			iconCls: 'x-fa fa-save',
			text: 'Save',
			bind: {
				disabled: '{!status.canSave}'
			},
			handler: 'onSaveTermClick'
		},
		{
			ui: 'soft-red',
			glyph:'',
			iconCls: 'x-fa fa-remove',
			text: 'Delete',
			bind: {
				disabled: '{!status.canDelete}'
			},
			handler: 'onDeleteTermClick'
		}
	],

	items: [
		{
			labelClsExtra: 'x-fa fa-gear',
			fieldLabel: 'Selected Term',
			items: [
				{
					fieldLabel: 'Name',
					bind: '{selectedTerm.name}'
				},
				{
					fieldLabel: 'Is Active?',
					xtype: 'fieldcontainer',
					layout: 'hbox',
					userCls: 'dateFieldContainer',
					items:[
						{
							xtype: 'checkbox',
							readOnly: true,
							bind: '{selectedTerm.active}'
						},
						{
							xtype: 'button',
							text: 'Make Active',
							iconCls: 'x-fa fa-calendar-check-o',
							margin: '0 0 0 20',
							handler: 'onMakeActiveTerm',
							bind: {
								hidden: '{selectedTerm.active}',
								disabled: '{status.canSave}'
							}
						}
					]
				},
				{
					xtype: 'checkbox',
					fieldLabel: 'Allow Judges to Login?',
					bind: '{selectedTerm.allowJudgeLogin}'
				},
				{
					xtype: 'checkbox',
					fieldLabel: 'Students Can See Grades?',
					bind: '{selectedTerm.showGrades}'
				},
				{
					xtype: 'numberfield',
					fieldLabel: 'Students per Judge',
					bind: '{selectedTerm.studentsPerJudge}'
				},
				{
					xtype: 'numberfield',
					fieldLabel: 'Display Order',
					bind: '{selectedTerm.display}'
				}
			]
		},
		{
			labelClsExtra: 'x-fa fa-globe',
			fieldLabel: 'Senior Project Website',
			items: [
				{
					fieldLabel: 'Url',
					bind: '{selectedTerm.srProjectUrl}'
				},
				{
					fieldLabel: 'Token',
					bind: '{selectedTerm.srProjectToken}'
				},
				{
					fieldLabel: 'Live Url',
					bind: '{selectedTerm.liveUrl}'
				},
				{
					fieldLabel: 'Development Url',
					bind: '{selectedTerm.developmentUrl}'
				},
				{
					fieldLabel: 'No Profile Image Url',
					bind: '{selectedTerm.noProfileImageUrl}'
				}
			]
		},
		{
			labelClsExtra: 'x-fa fa-envelope-o',
			fieldLabel: 'Email Settings',
			items: [
				{
					fieldLabel: 'From',
					emptyText: 'John Doe <username@example.com>',
					bind: '{selectedTerm.mailFrom}'
				},
				{
					xtype: 'combobox',
					queryMode: 'local',
					editable: false,
					emptyText: 'Select a Template',
					displayField: 'name',
					valueField: 'id',
					fieldLabel: 'Reset Password',
					bind: {
						store: 'templates4Term',
						value: '{selectedTerm.resetPasswordTemplate}'
					}
				},
				{
					xtype: 'combobox',
					queryMode: 'local',
					editable: false,
					emptyText: 'Select a Template',
					displayField: 'name',
					valueField: 'id',
					fieldLabel: 'Confirm Registration',
					bind: {
						store: 'templates4Term',
						value: '{selectedTerm.confirmTemplate}'
					}
				},
				{
					xtype: 'combobox',
					queryMode: 'local',
					editable: false,
					emptyText: 'Select a Template',
					displayField: 'name',
					valueField: 'id',
					fieldLabel: 'Reject Template',
					bind: {
						store: 'templates4Term',
						value: '{selectedTerm.rejectInviteTemplate}'
					}
				},
				{
					xtype: 'combobox',
					queryMode: 'local',
					editable: false,
					emptyText: 'Select a Template',
					displayField: 'name',
					valueField: 'id',
					fieldLabel: 'Remove Template',
					bind: {
						store: 'templates4Term',
						value: '{selectedTerm.removeInviteTemplate}'
					}
				}
			]
		},
		{
			labelClsExtra: 'x-fa fa-clock-o',
			fieldLabel: 'Event Info',
			items: [
				{
					fieldLabel: 'Start Time',
					xtype: 'fieldcontainer',
					layout: 'hbox',
					userCls: 'dateFieldContainer',
					items:[
						{
							xtype: 'datefield',
							flex: 1,
							bind: '{selectedTerm.startDate}'
						},
						{
							xtype: 'timefield',
							flex: 1,
							bind: '{selectedTerm.startTime}'
						}
					]
				},
				{
					fieldLabel: 'End Time',
					xtype: 'fieldcontainer',
					layout: 'hbox',
					userCls: 'dateFieldContainer',
					items:[
						{
							xtype: 'datefield',
							flex: 1,
							bind: '{selectedTerm.endDate}'
						},
						{
							xtype: 'timefield',
							flex: 1,
							bind: '{selectedTerm.endTime}'
						}
					]
				},
				{
					fieldLabel: 'Deadline',
					xtype: 'fieldcontainer',
					layout: 'hbox',
					userCls: 'dateFieldContainer',
					items:[
						{
							xtype: 'datefield',
							flex: 1,
							bind: '{selectedTerm.deadlineDate}'
						},
						{
							xtype: 'timefield',
							flex: 1,
							bind: '{selectedTerm.deadlineTime}'
						}
					]
				},
				{
					fieldLabel: 'Place',
					bind: '{selectedTerm.location}'
				},
				{
					fieldLabel: 'Map Url',
					bind: '{selectedTerm.mapImageUrl}'
				}
			]
		}
	]

});
