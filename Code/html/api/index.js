var config = require('./config/server.json'),
	_ = require('lodash');

GLOBAL.apiPrefix = config.apiPrefix || '';
GLOBAL.jsonDateReviver = function(key, value) {
	if ( typeof value === 'string' ) {
		return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.?\d{0,3}Z$/.test(value)
				? new Date(value)
				: value;
	}
	return value;
};
GLOBAL.mailer = require('./utils/mailer.js');

var server = require('./server'),
	models = require('./models'),
	routes = require('./routes')(server, models);

//require('./utils/crypt.js').upgradePasswords(models).then(_.noop);

server.listen(process.env.PORT || config.port, config.ip, function() {
	var address = server.address();
	console.log('Server listening at http://%s:%s', address.address, address.port);
});
