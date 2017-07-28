Ext.define('MobileJudge.view.charts.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.charts',

	model: null,

	init: function(view) {
		this.model = view.getViewModel();
		if (view.xtype == 'studenthome') this.loadProfile();
	},

	loadProfile: function(btn) {
		var me = this;
		if (btn) btn.setDisabled(true);
		Ext.Ajax.request({
			url: '/api/profile',
			method: 'GET',
			callback: function() {
				if (btn) btn.setDisabled(false);
			},
			success: function(resp) {
				var profile = Ext.decode(resp.responseText);
				Ext.each(profile, function(key) {
					me.model.set(key, profile[key]);
				});
			}
		});
	},

	tipRenderer: function (tooltip, record) {
		var total = 0;
		record.store.each(function(r) {
			total += r.get('total');
		});

		var percent = Math.floor((record.get('total') / total) * 100),
			state = record.get('state').split(':')[0];
		tooltip.setHtml(state + ': ' + percent + '%');
	},

	onRefreshChart: function(panel) {
		panel.down('polar').getStore().reload();
	}
});
