Ext.define('MobileJudge.view.judges.Question', {
	extend: 'Ext.Panel',
	xtype: 'judgequestion',

	requires: [
		'Ext.field.Slider',
		'Ext.field.TextArea'
	],

	cls: 'questionWizard shadow',
	scrollable: 'y',
	bodyPadding: 10,

	layout: {
		type:'vbox',
		align:'stretch'
	},

	header: {
		titleAlign: 'center'
	},

	bind: {
		//title: 'Question {progress}'
		title: '{question.text}'
	},

	items: [
		/*{
			xtype: 'component',
			margin: '0 0 10 0',
			bind: {
				html: '<div class="question">{question.text}</div>'
			}
		},*/
		{
			xtype: 'component',
			margin: '0 0 10 0',
			bind:   '<div class="search-user-item">' +
						'<div class="search-user-image">' +
							'<img src="{student.profileImgUrl}" class="circular" width="50" height="50" />' +
						'</div>' +
						'<div class="search-user-content">' +
							'<div class="search-user-title">{student.fullName}</div>' +
							'<div class="search-user-email">{student.project}</div>' +
							'<div class="search-user-date">{student.location}</div>' +
						'</div>' +
					'</div>'
		},
		{
			xtype: 'component',
			html: 'Grade'
		},
		{
			xtype: 'container',
			layout: 'hbox',
			items:[
				{
					xtype: 'sliderfield',
					name: 'grade',
					flex: 1,
					increment: 1,
					minValue: 1,
					bind: {
						value: '{grade.value}',
						maxValue: '{question.value}',
						hidden: '{isAccepted}'
					}
				},
				{
					xtype: 'container',
					padding: '14 0',
					bind: {
						html: '{gradeDisplay}'
					}
				}
			]
		},
		{
			xtype: 'component',
			margin: '0 0 5 0',
			html: 'Comments'
		},
		{
			xtype: 'textareafield',
			name: 'comment',
			bind: {
				value: '{grade.comment}',
				hidden: '{isAccepted}'
			}
		},
		{
			xtype: 'component',
			bind: {
				html: '{grade.comment}',
				hidden: '{!isAccepted}'
			}
		},
		{
			xtype: 'container',
			margin: '10 0',
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
					handler: 'onPrevBtn'
				},
				{
					html: '<div></div>',
					flex: 1
				},
				{
					xtype: 'button',
					ui: 'soft-blue',
					iconAlign: 'right',
					handler: 'onNextBtn',
					bind: {
						text: '{next.text}',
						iconCls: '{next.icon}'
					}
				},
				{
					html: '<div></div>',
					flex: 1
				}
			]
		}
	]

});
