Ext.define('MobileJudge.view.students.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.student',

	model: null,

	init: function(view) {
		this.model = view.getViewModel();
		this.loadProfile();
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
	}
});
