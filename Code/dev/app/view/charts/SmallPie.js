Ext.define('MobileJudge.view.charts.SmallPie', {
	extend: 'Ext.chart.PolarChart',
	xtype: 'smallpie',

	interactions: 'rotate',

	platformConfig: {
		classic: {
			insetPadding: 10,
			innerPadding: 10,
			legend: {
				docked: 'bottom'
			}
		},
		modern: {
			insetPadding: 20,
			innerPadding: 20
		}
	},

	series: [
		{
			type: 'pie3d',
			donut: 30,
			angleField: 'total',
			highlight: true,
			label: {
				field: 'state',
				calloutLine: {
					width: 3
				}
			},
			platformConfig: {
				classic: {
					tooltip: {
						trackMouse: true,
						renderer: 'tipRenderer'
					}
				}
			}
		}
	]

});
