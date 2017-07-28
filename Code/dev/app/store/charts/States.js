Ext.define('MobileJudge.store.charts.States', {
	extend: 'Ext.data.Store',
	alias: 'store.chartStates',

	fields: ['state', 'total'],

	autoLoad: true,
	pageSize: 0
});
