var crypto = require('crypto'),
	bcrypt = require('bcrypt'),
	jwt = require('jsonwebtoken'),
	rjwt = require('restify-jwt'),
	Promise = require('bluebird'),
	config = require('../config/server.json');

module.exports = {
	encrypt: function (text) {
		var cipher = crypto.createCipher(config.crypt.algorithm, config.crypt.secret);
		var crypted = cipher.update(text, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted.toUpperCase();
	},
	decrypt: function (text){
		var decipher = crypto.createDecipher(config.crypt.algorithm, config.crypt.secret);
		var dec = decipher.update(text.toUpperCase(),'hex','utf8');
		dec += decipher.final('utf8');
		return dec;
	},
	randomValueHex: function (len) {
		return crypto.randomBytes(Math.ceil(len / 2))
			.toString('hex') // convert to hexadecimal format
			.slice(0, len);  // return required number of characters
	},
	hashPassword: function(data) {
		return new Promise(function(resolve, reject){
			bcrypt.hash(data, config.crypt.hashLength, function(err, data){
				if (err) return reject(err);
				resolve(data);
			});
		});
	},
	verifyPassword: Promise.promisify(bcrypt.compare),
	serializeToken: function(payload) {
		return jwt.sign(payload, config.crypt.secret, {
			expiresIn: config.crypt.tokenExpiration
		});
	},
	authToken: function() {
		return rjwt({secret: config.crypt.secret}).unless({
			path: [
				//config.apiPrefix + '/maps',
				config.apiPrefix + '/judges/import',
				config.apiPrefix + '/login',
				config.apiPrefix + '/register',
				config.apiPrefix + '/students',
				new RegExp(config.apiPrefix + '/reset(/[A-Z0-9]+)?'),
				new RegExp(config.apiPrefix + '/invite/[A-Z0-9]+/(accept)|(decline)|(remove)')
			].concat(config.statics.map(function(i) {
				return new RegExp(i.route);
			}))
		});
	},
	refreshToken: function() {
		var me = this;
		return function(req, res, next) {
			if (req.user) {
				res.header('X-AUTH-TOKEN', me.serializeToken({
					role: req.user.role,
					id: req.user.id
				}));
			}
			return next();
		};
	},
	upgradePasswords: function(db) {
		var me = this;
		return db.user.findAll({
			where: db.sequelize.where(db.sequelize.fn('length', db.sequelize.col('password')), '<>', 60)
		}).then(function(users) {
			return Promise.map(users, function(u) {
				return me.hashPassword(u.password).then(function(hash) {
					u.password = hash;
					return u.save();
				});
			});
		});
	}
};
