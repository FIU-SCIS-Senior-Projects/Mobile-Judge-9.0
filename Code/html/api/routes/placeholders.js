var epilogue = require('epilogue');

module.exports = function(server, db) {

	var removeId = epilogue.resource({
		model: db.placeholder,
		excludeAttributes: ['createdAt','updatedAt'],
		pagination: false,
		endpoints: [apiPrefix + '/placeholders', apiPrefix + '/placeholders/:id']
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
