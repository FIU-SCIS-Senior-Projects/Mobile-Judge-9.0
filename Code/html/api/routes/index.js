var fs       = require('fs'),
	path     = require('path'),
	basename = path.basename(module.filename),
	epilogue = require('epilogue'),
	routes   = {};

module.exports = function(server, models) {
	epilogue.initialize({
		app: server,
		sequelize: models.sequelize
	});

	fs
		.readdirSync(__dirname)
		.filter(function(file) {
			return (file.indexOf('.') !== 0) && (file !== basename);
		})
		.forEach(function(file) {
			if (file.slice(-3) !== '.js') return;
			var name = path.basename(file, '.js');
			routes[name] = require(path.join(__dirname, file))(server, models);
		});

	return routes;
};
