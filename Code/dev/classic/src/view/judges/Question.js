Ext.define('MobileJudge.view.judges.Question', {
	extend: 'Ext.form.Panel',
	xtype: 'judgequestion',

	requires: [
		'Ext.slider.Single',
		'Ext.form.field.Display',
		'Ext.form.field.TextArea'
	],

	cls: 'questionWizard shadow',

	layout: {
		type:'vbox',
		align:'stretch'
	},

	bodyPadding: 10,
	defaults: {
		labelWidth: 80,
		labelSeparator: ''
	},

	items: [
		{
			xtype: 'component',
			margin: '0 0 10 0',
			bind: '<div class="search-user-item">' +
					'<div class="search-user-image">' +
						'<img src="{student.profileImgUrl}" class="circular" width="50" height="50" />' +
					'</div>' +
					'<div class="search-user-content">' +
						'<div class="search-user-title">{student.fullName}</div>' +
						'<div class="search-user-email">{student.project}</div>' +
						//'<a href="#map" class="location">{student.location}</a>' +
					'</div>' +
				  '</div>'
		},
		{
			fieldLabel: 'Grade',
			xtype: 'fieldcontainer',
			layout: 'hbox',
			items:[
				{
					xtype: 'sliderfield',
					name: 'grade',
					flex: 1,
					minValue: 0,
					increment: 1,
					publishOnComplete: false,
					bind: {
						value:'{grade.value}',
						maxValue: '{question.value}',
						hidden: '{isAccepted}'
					}
				},
				{
					xtype: 'displayfield',
					margin: '0 10',
					bind: '{gradeDisplay}'
				}
			]
		},
		{
			xtype: 'textarea',
			fieldLabel: 'Comments',
			grow: true,
			name: 'comment',
			bind: {
				value: '{grade.comment}',
				hidden: '{isAccepted}'
			}
		},
		{
			xtype: 'displayfield',
			fieldLabel: 'Comments',
			bind: {
				value: '{grade.comment}',
				hidden: '{!isAccepted}'
			}
		}
	],

	tbar: {
		items: [
			{
				ui: 'soft-blue',
				iconCls: 'x-fa fa-angle-left',
				text: 'Back',
				handler: 'onPrevBtn'
			},
			'->',
			{
				xtype: 'tbtext',
				bind: {
					text: '{question.text}'
				}
			},
			'->',
			{
				ui: 'soft-blue',
				iconAlign: 'right',
				handler: 'onNextBtn',
				bind: {
					text: '{next.text}',
					iconCls: '{next.icon}',
					UI: '{next.ui}'
				}
			}
		]
	}

});
