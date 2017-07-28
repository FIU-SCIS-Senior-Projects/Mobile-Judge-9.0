var notFound = require('restify').errors.NotFoundError,
	url = require("url"),
	path = require("path"),
	qs = require('querystring'),
	/*fetch = require('node-fetch'),
	normalize = require("header-case-normalizer"),*/
	_ = require('lodash');

module.exports = function(server, db) {

	server.get(apiPrefix + '/maps', function (req, res, next) {
		db.term.getActiveTerm().then(function (term) {
			if (term == null) return next(new notFound());

			res.json(_.map(term.mapImageUrl.split(','), function(imgUrl) {
				return {
					name: qs.unescape(path.basename(url.parse(imgUrl).pathname).split('.')[0]),
					url: imgUrl
				};
			}));
			next();

			/*fetch(term.mapImageUrl)
				.then(function (image) {
					if (!image.ok) return next(new notFound());

					var headers = image.headers.raw();
					Object.keys(headers).forEach(function (key) {
						res.header(normalize(key), image.headers.get(key));
					});

					image.body.pipe(res);
					next();
				});*/
		});
	});

};
