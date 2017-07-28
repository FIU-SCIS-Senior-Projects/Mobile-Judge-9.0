Ext.define('MobileJudge.store.NavigationTree', {
	extend: 'Ext.data.TreeStore',
	storeId: 'NavigationTree',

	proxy: {
		type: 'ajax',
		noCache: false,
		url: '/api/navtree'
	},

	fields: [{ name: 'text' }],

	//autoLoad: true,
	listeners: {
		load: function() {
			Ext.GlobalEvents.fireEvent('navTreeReady');
		}
	}
});
