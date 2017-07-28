Ext.define('MobileJudge.view.students.Profile', {
	extend: 'Ext.panel.Panel',
	xtype: 'profile',

	requires: [
		'Ext.Button',
		'Ext.Container'
	],

	layout: {
		type: 'vbox',
		align: 'middle'
	},

	height: 350,
	bodyPadding: 20,

	items: [
		{
			xtype: 'image',
			cls: 'userProfilePic',
			height: 120,
			width: 120,
			alt: 'profile-picture',
			bind: {
				src: '{profileImgUrl}'
			}
		},
		{
			xtype: 'component',
			cls: 'userProfileName',
			height: '',
			bind: {
				html: '{fullName}'
			}
		},
		{
			xtype: 'component',
			cls: 'userProfileDesc',
			bind: {
				html: '{email}'
			}
		},
		{
			xtype: 'component',
			cls: 'userProfileDesc',
			bind: {
				html: '{id}'
			}
		},
		{
			xtype: 'component',
			margin: '10 0 0 0',
			cls: 'userProfileDesc',
			bind: {
				html: '{project}'
			}
		},
		{
			xtype: 'component',
			cls: 'userProfileDesc',
			bind: {
				html: '<a href="#map">{location}</a>'
			}
		},
		{
			xtype: 'component',
			margin: '10',
			cls: 'userProfileDesc',
			bind: {
				html: 'Grade: {grade_display}'
			}
		},
		{
			xtype: 'button',
			margin: 5,
			width: 220,
			text: 'Refresh',
			handler: 'loadProfile',
			platformConfig: {
				classic: {
					scale: 'large'
				},
				modern: {
					ui: 'action'
				}
			}
		}
	]
});
