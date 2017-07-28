var notFound = require('restify').errors.NotFoundError,
	badRequest = require('restify').errors.BadRequestError,
	Promise = require('bluebird'),
	crypt = require('../utils/crypt.js'),
	_ = require('lodash');

module.exports = function(server, db) {

	server.post(apiPrefix + '/login', function (req, res, next) {
		if (req.body === undefined
			|| (req.body.email === undefined && req.body.id === undefined)
			|| (req.body.password === undefined && req.body.provider === undefined)) {
			return next(new badRequest('Missing username and/or password'));
		}

		var email = req.body.email,
			provider = req.body.provider || 'local',
			password = req.body.password,
			errorResponse = function(msg) {
				res.json({
					result: false,
					error: msg
				});
				return next();
			},
			invalidCredentials = function () {
				return errorResponse('The information you entered does not match any of our active records');
			},
			search = {};

		if (provider == 'local') {
			search = { email: email };
		}
		else {
			search = {
				'$or': [
					{oauth: {'$like': JSON.stringify(_.set({}, provider, req.body.id)).replace(/^\{|\}$/g, '%')}},
					{oauth: {'$like': JSON.stringify(_.set({}, provider, {id: req.body.id})).replace(/^\{|\}$/g, '%')}}
				]
			};

			if (email) search['$or'].push({ email: email });
		}

		Promise.all([
			db.student.findOne({ where: search }),
			db.judge.findOne({ where: search }),
			db.user.scope('admins').findOne({ where: search }),
			db.term.getActiveTerm()
		])
		.then(function(arr){
			var term = arr.pop(),
				index = _.findLastIndex(arr);

			if (index < 0 || index > 2 ||
			   (provider === 'local' && (!password || !arr[index].password))) return invalidCredentials();

			(provider !== 'local' ? Promise.resolve(true)
				: crypt.verifyPassword(password, arr[index].password))
					.then(function(pass){
						if (!pass) return invalidCredentials();

						var user = arr[index],
							token = {
								role: index + 1,
								id: user.id
							};

						switch(index) {
							case 0: // student
								if (user.abbr != 'AC') return invalidCredentials();
								break;

							case 1: // judge
								if (!term.allowJudgeLogin) return errorResponse('The login for judges has not yet been activated by the admin. Please try again during the event.');
								if (['RG','AT','ST','GR'].indexOf(user.abbr) < 0) return errorResponse('Please finish the judge registration process.');
								if (user.abbr == 'RG') {
									var now = new Date();
									if (term.start < now && now < term.end) {
										db.user.update({ state: 6 }, { // Attended
											where: {
												id: user.id
											}
										}).then(_.noop);
									}
								}
								break;

							case 2: // admin
								if (user.state != 13) return invalidCredentials();
								break;
						}

						res.json({
							result: true,
							token: crypt.serializeToken(token),
							profile: {
								activeTerm: term.name,
								userName: user.fullName,
								title: user.title,
								email: user.email,
								profilePic: user.profileImgUrl || term.noProfileImageUrl
							}
						});
						next();
					});
		});
	});

	server.post(apiPrefix + '/register', function (req, res, next) {
		var _user = req.body;

		if (!_user || !_user.email || !_user.id || !_user.password) {
			return next(new badRequest('Missing id, username and/or password'));
		}

		Promise.all([
			db.term.getActiveTerm(),
			db.user.findById(_user.id)
		]).then(function(arr) {
			var term = arr[0], user = arr[1];

			if (user == null) return next(new notFound());
			crypt.hashPassword(_user.password).then(function(hash) {
				user.password = hash;
				user.email = _user.email || user.email;
				user.fullName = _user.fullName || user.fullName;
				user.firstName = _user.firstName || user.firstName;
				user.lastName = _user.lastName || user.lastName;
				user.salutation = _user.salutation || user.salutation;
				user.affiliation = _user.affiliation || user.affiliation;
				user.title = _user.title || user.title;
				user.oauth = _user.oauth || user.oauth;
				if (_user.profilePic && !user.profileImgUrl) user.profileImgUrl = _user.profilePic;
				user.state = 5;
				user.save().then(function() {
					db.email.create({
						address: user.email,
						userId: user.id,
						termId: term.id,
						templateId: term.confirmTemplate
					}).then(function(mail){
						mail.render().then(function(render) {
							mailer.sendMail({
								from: term.mailFrom,
								to: render.address,
								subject: render.subject,
								html: render.body
							}, _.noop);
						});
					});
				});
			});

			db.sequelize.query('call onlinejudges7.sp_assignStudents(?, ?);', {
				replacements: [_user.id, (_user.conflicts || []).join()]
			}).then(_.noop);

			if (!term.allowJudgeLogin) {
				res.json({
					result: false,
					error: 'Thank you! You have been registered successfully!<br />Please note that you cannot login at this time as the login is disabled by the admin.<br />You should check later.'
				});
				return next();
			}

			res.json({
				result: true,
				token: crypt.serializeToken({ role: 2, id: _user.id }),
				profile: {
					activeTerm: term.name,
					userName: user.fullName,
					title: user.title || '',
					email: user.email,
					profilePic: user.profileImgUrl || term.noProfileImageUrl
				}
			});
			next();
		});
	});

	server.post(apiPrefix + '/reset', function(req, res, next) {
		var _user = req.body;
		if (!_user || !_user.email) return next(new badRequest('Missing email address'));

		db.term.getActiveTerm().then(function(term){
			db.user.findOne({
				where: {
					email: _user.email,
					termId: term.id
				}
			}).then(function(user){
				if (user == null) return next(new notFound('Invalid email address'));

				db.email.create({
					address: user.email,
					userId: user.id,
					termId: term.id,
					templateId: term.resetPasswordTemplate
				}).then(function(mail){
					mail.render().then(function(render) {
						mailer.sendMail({
							from: term.mailFrom,
							to: render.address,
							subject: render.subject,
							html: render.body
						}, _.noop);
					});

					res.json({
						result: true,
						error: 'Please check your email for further instructions on how to reset your password.'
					});
					next();
				});
			});
		});
	});

	server.put(apiPrefix + '/reset', function(req, res, next) {
		var _user = req.body;
		if (!_user || !_user.id) return next(new badRequest('Missing user id'));
		if (!_user.newPassword) return next(new badRequest('Password can not be empty'));
		if (_user.newPassword !== _user.confirmPassword) return next(new badRequest('Passwords don\'t match, please try again'));

		Promise.all([
			db.term.getActiveTerm(),
			db.user.findById(_user.id)
		]).then(function(arr) {
			var term = arr[0], user = arr[1];
			crypt.hashPassword(_user.newPassword).then(function(hash) {
				user.password = hash;
				user.save().then(function() {
					if (user.role == 2 && !term.allowJudgeLogin) {
						res.json({
							result: false,
							error: 'Your password have been changed successfully!<br />Please note that you cannot login at this time as the login is disabled by the admin.<br />You should check later.'
						});
						return next();
					}

					res.json({
						result: true,
						token: crypt.serializeToken({ role: user.role, id: _user.id }),
						profile: {
							activeTerm: term.name,
							userName: user.fullName,
							title: user.title || '',
							email: user.email,
							profilePic: user.profileImgUrl || term.noProfileImageUrl
						}
					});
					next();
				});
			});
		});
	});
};
