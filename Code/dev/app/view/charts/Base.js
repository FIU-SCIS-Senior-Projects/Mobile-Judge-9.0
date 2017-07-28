Ext.define('MobileJudge.view.charts.Base', {
	extend: 'Ext.Panel',
	xtype: 'basepie',

	requires: [
		'Ext.chart.PolarChart',
		'Ext.chart.interactions.ItemHighlight',
		'Ext.chart.interactions.Rotate',
		'Ext.chart.interactions.RotatePie3D',
		'Ext.chart.series.Pie',
		'Ext.chart.series.Pie3D'
	],

	cls: 'quick-graph-panel shadow',

	ui: 'light',
	layout: 'fit',

	platformConfig: {
		classic: {
			headerPosition: 'top'
		},
		modern: {
			header: {
				docked: 'top'
			}
		}
	},

	tools: [
		{
			type: 'refresh',
			tooltip: 'Refresh',
			callback: 'onRefreshChart'
		}
	],

	defaults: {
		width: '100%'
	}
});
