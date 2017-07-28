var notFound = require('restify').errors.NotFoundError,
	epilogue = require('epilogue');

module.exports = function(server, db) {
	server.get(apiPrefix + '/projects', function (req, res, next) {
		db.term.getActiveTerm().then(function(term) {
			if (term == null) {
				return next(new notFound());
			}

			term.getProjects({
				attributes: ['id', 'name']
			}).then(function(p){
				res.send(p);
				next();
			});
		});
	});

	return {
		crud: epilogue.resource({
			model: db.project,
			excludeAttributes: ['createdAt','updatedAt'],
			actions: ['create', 'read', 'update', 'delete'],
			endpoints: [apiPrefix + '/projects', apiPrefix + '/projects/:id']
		})
	};
};
