var notFound = require('restify').errors.NotFoundError,
	epilogue = require('epilogue');

module.exports = function(server, db) {

	server.get(apiPrefix + '/templates/:templateId/preview', function (req, res, next) {
		db.template.getPreview(req.user.id, req.params.templateId).then(function(preview) {
			if (preview == null) {
				return next(new notFound());
			}

			res.send({
				subject: preview[0],
				body: preview[1]
			});
			next();
		});
	});

	var removeId = epilogue.resource({
		model: db.template,
		excludeAttributes: ['createdAt','updatedAt'],
		pagination: false,
		endpoints: [apiPrefix + '/templates', apiPrefix + '/templates/:id']
	});

	removeId.use({
		create: {
			write: {
				before: function (req, res, context) {
					delete req.body['id'];
					delete req.params['id'];
					return context.continue;
				}
			}
		}
	});

	return removeId;
};
