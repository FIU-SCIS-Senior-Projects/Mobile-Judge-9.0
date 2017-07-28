var epilogue = require('epilogue'),
	notFound = require('restify').errors.NotFoundError,
	_ = require('lodash');

module.exports = function(server, db) {
	server.get(apiPrefix + '/profile', function (req, res, next) {
		var model = req.user.role == 1 ? db.student : db.judge;
		model.findById(req.user.id).then(function (user) {
			if (user == null) return next(new notFound());
			res.send(_.omit(user.toJSON(), ['oauth', 'password', 'grade']));
			next();
		});
	});

	return {
		crud: epilogue.resource({
			model: db.user,
			excludeAttributes: ['createdAt','updatedAt','password','oauth'],
			actions: ['create', 'read', 'update', 'delete'],
			endpoints: [apiPrefix + '/users', apiPrefix + '/users/:id']
		})
	};
};
