Ext.define('MobileJudge.view.charts.Judges', {
	extend: 'MobileJudge.view.charts.Base',
	xtype: 'chartjudges',

	title: 'Judge States',

	items: [
		{
			xtype: 'polar',
			bind: '{judges}',

			platformConfig: {
				classic: {
					interactions: 'rotatePie3d',
					insetPadding: 20,
					innerPadding: 20,
					legend: {
						docked: 'right'
					},
					series: [
						{
							type: 'pie3d',
							angleField: 'total',
							donut: 30,
							highlight: {
								margin: 40
							},
							label: {
								field: 'state',
								calloutLine: {
									length: 60,
									width: 3
									// specifying 'color' is also possible here
								}
							},
							tooltip: {
								trackMouse: true,
								renderer: 'tipRenderer'
							}
						}
					]
				},
				modern: {
					interactions: 'rotate',
					insetPadding: 10,
					innerPadding: 10,
					series: [
						{
							type: 'pie3d',
							angleField: 'total',
							donut: 30,
							highlight: true,
							label: {
								field: 'state'/*,
								calloutLine: {
									width: 3
								}*/
							}
						}
					]
				}
			}
		}
	]
});
