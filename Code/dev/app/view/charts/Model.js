Ext.define('MobileJudge.view.charts.ChartsModel', {
	extend: 'Ext.app.ViewModel',
	alias: 'viewmodel.charts',

	stores: {
		judges: {
			type: 'chartStates',
			storeId: 'chartJudgeStates',
			proxy: {
				type: 'api',
				url: '/api/charts/judges'
			}
		},
		students: {
			type: 'chartStates',
			storeId: 'chartStudentStates',
			proxy: {
				type: 'api',
				url: '/api/charts/students'
			}
		},
		graded: {
			type: 'chartStates',
			storeId: 'chartGradedStates',
			proxy: {
				type: 'api',
				url: '/api/charts/graded'
			}
		},
		accepted: {
			type: 'chartStates',
			storeId: 'chartAcceptedStates',
			proxy: {
				type: 'api',
				url: '/api/charts/accepted'
			}
		}
	}
});
