Ext.define('MobileJudge.view.judges.Students', {
	extend: 'Ext.Panel',
	xtype: 'judgestudents',

	layout: 'vbox',
	title: 'Students',

	/*tools: [
		{
			type: 'refresh',
			handler: 'onStudentsRefresh'
		}
	],*/

	items: [
		{
			xtype: 'list',
			cls: 'studentSelector',
			disableSelection: true,
			flex: 1,
			plugins: [
				{
					xclass: 'Ext.plugin.PullRefresh'
				}
			],
			bind: {
				store: '{students}'
			},
			listeners: {
				itemtap: 'onItemTap'
			},
			itemTpl:
			'<div class="search-user-item">' +
				'<div class="search-user-image">' +
					'<img src="{profileImgUrl}" class="circular" width="50" height="50"/>' +
				'</div>' +
				'<div class="search-user-icon {iconCls}"></div>' +
				'<div class="search-user-content">' +
					'<div class="search-user-title">{fullName}</div>' +
					'<div class="search-user-email">{project}</div>' +
					'<div class="search-user-date">{location}</div>' +
				'</div>' +
			'</div>'
		}
	]
});
