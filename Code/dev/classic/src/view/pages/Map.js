Ext.define('MobileJudge.view.pages.Map', {
	extend: 'Ext.tab.Panel',
	xtype: 'eventmap',

	cls: 'shadow',
	margin: 20,

	defaultType: 'panel',
	defaults: {
		scrollable: true,
		layout: 'fit',
		iconCls: 'x-fa fa-map-o'
	},

	listeners: {
		afterrender: function(panel) {
			Ext.Ajax.request({
				url: '/api/maps',
				success: function(resp) {
					var locations = Ext.decode(resp.responseText);

					panel.add(locations.map(function(l) {
						return {
							title: l.name,
							items: [
								{
									xtype: 'image',
									alt: l.name,
									src: l.url
								}
							]
						};
					}));

					panel.setActiveTab(0);
				}
			});
		}
	}
});
