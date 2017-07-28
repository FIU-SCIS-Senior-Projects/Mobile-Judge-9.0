var epilogue = require('epilogue');

module.exports = function(server, db) {
	return epilogue.resource({
		model: db.question,
		excludeAttributes: ['createdAt','updatedAt'],
		endpoints: [apiPrefix + '/questions', apiPrefix + '/questions/:id'],
		pagination: false,
		sort: {
			default: 'display'
		}
	});
};
