require('pmx').init({ http: true });

var config = require('./config/server.json'),
	crypt = require('./utils/crypt.js'),
	restify = require('restify'),
	formatters = require('./utils/formatters.js'),
	server = restify.createServer({
		formatters: formatters(restify)
	});

server.use(restify.acceptParser(server.acceptable));
server.use(crypt.authToken());
server.use(crypt.refreshToken());
server.use(restify.CORS());
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser({	reviver: jsonDateReviver }));
server.use(restify.conditionalRequest());

(config.statics || []).forEach(function(i){
	server.get(new RegExp(i.route), restify.serveStatic({
		directory: __dirname + i.path,
		default: 'index.html'
	}));
});

module.exports = server;
