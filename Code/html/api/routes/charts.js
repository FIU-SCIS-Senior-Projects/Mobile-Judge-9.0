var epilogue = require('epilogue');

module.exports = function(server, db) {
	return {
		judges: epilogue.resource({
			model: db.stats_judges,
			endpoints: [apiPrefix + '/charts/judges'],
			actions: ['list'],
			pagination: false
		}),
		students: epilogue.resource({
			model: db.stats_students,
			endpoints: [apiPrefix + '/charts/students'],
			actions: ['list'],
			pagination: false
		}),
		graded: epilogue.resource({
			model: db.stats_graded,
			endpoints: [apiPrefix + '/charts/graded'],
			actions: ['list'],
			pagination: false
		}),
		accepted: epilogue.resource({
			model: db.stats_accepted,
			endpoints: [apiPrefix + '/charts/accepted'],
			actions: ['list'],
			pagination: false
		})
	};
};
