var notFound = require('restify').errors.NotFoundError,
	epilogue = require('epilogue'),
	Promise = require('bluebird'),
	_ = require('lodash');

module.exports = function(server, db) {

	// gets the current active term
	server.get(apiPrefix + '/term', function (req, res, next) {
		db.term.getActiveTerm().then(function(term) {
			if (term == null) return next(new notFound());
			res.send(term.toJSON());
			next();
		});
	});

	var excludeExtra = epilogue.resource({
			model: db.term,
			excludeAttributes: ['createdAt','updatedAt'],
			actions: ['list'],
			pagination: false,
			endpoints: [apiPrefix + '/terms']
		}),
		crud = epilogue.resource({
			model: db.term,
			excludeAttributes: ['createdAt','updatedAt'],
			actions: ['create', 'read', 'update', 'delete'],
			endpoints: [apiPrefix + '/terms', apiPrefix + '/terms/:id']
		});

	excludeExtra.use({
		list: {
			fetch: {
				before: function (req, res, context) {
					context.criteria = _.assign({
						id: {
							$ne: 0
						}
					}, req.params, context.criteria);
					return context.continue;
				}
			}
		}
	});

	crud.use({
		create: {
			write: {
				before: function (req, res, context) {
					delete req.body['id'];
					delete req.params['id'];
					return context.continue;
				}
			}
		},
		update: {
			write:{
				before: function (req, res, context) {
					return (req.params.active
							? db.sequelize.query('UPDATE terms SET active = false WHERE active = true;')
							: Promise.resolve(true)).then(function() {
						return context.continue;
					});
				}
			}
		}
	});

	return {
		exclude: excludeExtra,
		crud: crud
	};
};
