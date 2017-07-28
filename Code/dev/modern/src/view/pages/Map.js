Ext.define('MobileJudge.view.pages.Map', {
	extend: 'Ext.TabPanel',
	xtype: 'eventmap',

	listeners: {
		initialize: function(panel) {
			Ext.Ajax.request({
				url: '/api/maps',
				success: function(resp) {
					var locations = Ext.decode(resp.responseText);
					panel.add(locations.map(function(l) {
						return {
							xtype: 'imageviewer',
							iconCls: 'x-fa fa-map-o',
							title: l.name,
							imageSrc: l.url
						};
					}));
				}
			});
		}
	}
});
