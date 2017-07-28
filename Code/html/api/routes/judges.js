var epilogue = require('epilogue'),
	badRequest = require('restify').errors.BadRequestError,
	fs = require('fs'),
	csv = require('csv'),
	_ = require('lodash');

module.exports = function(server, db) {

	server.post(apiPrefix + '/judges/import', function(req, res, next) {
		if (req.files === undefined || req.files.judgesCsv === undefined) {
			return next(new badRequest('missing file'));
		}

		var file = req.files.judgesCsv;

		Promise.all([
			db.term.getActiveTerm({ attributes: ['id'] }),
			db.user.findAll({
				attributes: [[db.sequelize.fn('MAX', db.sequelize.col('id')), 'id']],
				where: {
					role: 2
				}
			})
		]).then(function (arr) {
			file.skipped = 0; file.records = 0;
			var termId = arr[0].id,
				id = (arr[1][0] || []).length == 0 ? 1 : arr[1][0].get('id'),
				regex = /^(?:\w+[\-\.])*\w+@(?:\w+[\-\.])*\w+\.\w+$/;
				transform = csv.transform(function (record, callback) {
					if (!regex.test(record.email)) {
						callback(null, null);
						return;
					}
					_.assign(record, {
						termId: termId,
						state: 1,
						role: 2,
						projectId: 0,
						location: 0
					});

					db.user.count({
						where: {
							email: record.email,
							'$or': [
								{termId: termId},
								{role: 2, state: 12}
							]
						}
					}).then(function (judges) {
						file.records++;
						if (judges != 0) file.skipped++;
						callback(null, judges != 0
								? null
								: _.assign(record, {
							id: id + file.records - file.skipped //transform.running - arr[2]
						}));
					});

				}, function (err, output) {
					if (err) {
						res.send(err.message);
						return next();
					}

					db.user.bulkCreate(output).then(function() {
						res.json({
							success: true,
							fileName: file.name,
							fileSize: file.size,
							total: file.records,
							records: output.length,
							skipped: file.skipped
						});
						next();
					});
				});

			fs.createReadStream(file.path)
				.pipe(csv.parse({
					columns: ['email', 'firstName', 'lastName'],
					skip_empty_lines: true,
					trim: true
				}))
				.pipe(transform);
		});
	});

	return epilogue.resource({
		model: db.judge,
		excludeAttributes: ['password','oauth'],
		actions: ['list'],
		search: {
			param: 'query',
			attributes: [ 'fullName', 'affiliation', 'email' ]
		},
		endpoints: [apiPrefix + '/judges']
	});
};
