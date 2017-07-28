var notFound = require('restify').errors.NotFoundError,
	crypt = require('../utils/crypt.js'),
	config = require('../config/server.json'),
	_ = require('lodash');

module.exports = function(server, db) {

	var retrieveEmail = function(invite) {
		var sentId = crypt.decrypt(invite.toUpperCase()).split(','),
			emailId = sentId[0], createdAt = new Date(parseInt(sentId[1]));
		return Promise.all([
			db.email.findOne({
				where: {
					id: emailId,
					createdAt: createdAt
				}
			}),
			db.term.getActiveTerm()
		]);
	};

	var setState = function(user, state) {
		user.state = state;
		user.save().then(_.noop);
	};

	var undoRegistration = function(judge) {
		//if (judge.state > 4 && user.state < 7) {
			db.sequelize.query('DELETE FROM grades WHERE judgeId = ? AND updatedAt IS NULL AND state = 0;', {
				replacements: [judge.id]
			}).then(_.noop);
		//}
	};

	var response ='<!DOCTYPE html>' +
			'<html lang="en">' +
			'<head>' +
				'<meta http-equiv="X-UA-Compatible" content="IE=edge">' +
				'<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">' +
				'<meta charset="utf-8">' +
				'<title>[[subject]]</title>' +
				'<!--[if lt IE 9]>' +
				'<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>' +
				'<![endif]-->' +
			'</head>' +
			'<body>[[body]]</body>' +
			'</html>';

	server.get(apiPrefix + '/invite/:id/accept', function (req, res, next) {
		retrieveEmail(req.params.id)
			.then(function(ret) {
				var email = ret[0], term = ret[1];
				if (email == null || email.termId != term.id) return next(new notFound('Invalid invite id'));

				db.user.findById(email.userId).then(function (user) {
					if (user.state <= 2) setState(user, 4);

					var script = '<script type="text/javascript">' +
						'localStorage.setItem("userId", ' + JSON.stringify(user.id) + ');' +
						'localStorage.setItem("email", ' + JSON.stringify(user.email) +');' +
						(user.fullName ? 'localStorage.setItem("userName", ' + JSON.stringify(user.fullName) +');' : 'localStorage.removeItem("userName");') +
						'window.location.replace("' + config.registerRedirect + '");' +
					'</script>';

					res.html(response
							.replace(/\[\[subject\]\]/, 'Please wait...')
							.replace(/\[\[body\]\]/, script));
					next();
					db.touch(email);
				});
			});
	});

	server.get(apiPrefix + '/invite/:id/decline', function (req, res, next) {
		retrieveEmail(req.params.id)
			.then(function(ret) {
				var email = ret[0], term = ret[1];
				if (email == null || email.termId != term.id) return next(new notFound('Invalid invite id'));

				db.template.getPreview(email.userId, term.rejectInviteTemplate).then(function(render) {
					if (render == null) return next(new notFound());

					res.html(response
							.replace(/\[\[subject\]\]/, render[0])
							.replace(/\[\[body\]\]/, render[1]));
					next();
				});

				db.user.findById(email.userId).then(function (user) {
					if (user.state > 4 && user.state < 12) undoRegistration(user);
					setState(user, 3);
				});

				db.touch(email);
			});
	});

	server.get(apiPrefix + '/invite/:id/remove', function (req, res, next) {
		retrieveEmail(req.params.id)
			.then(function(ret) {
				var email = ret[0], term = ret[1];
				if (email == null || email.termId != term.id) return next(new notFound('Invalid invite id'));

				db.template.getPreview(email.userId, term.removeInviteTemplate).then(function(render) {
					if (render == null) return next(new notFound());

					res.html(response
							.replace(/\[\[subject\]\]/, render[0])
							.replace(/\[\[body\]\]/, render[1]));
					next();
				});

				db.user.findById(email.userId).then(function (user) {
					if (user.state > 4 && user.state < 12) undoRegistration(user);
					setState(user, 12);
				});

				db.touch(email);
			});
	});

	server.get(apiPrefix + '/reset/:id', function (req, res, next){
		retrieveEmail(req.params.id)
			.then(function(ret) {
				var email = ret[0], term = ret[1];

				if (email == null
					|| email.termId != term.id
					|| email.templateId != term.resetPasswordTemplate
					|| (email.updatedAt != null && email.updatedAt > email.createdAt))
					return next(new notFound('Invalid reset id'));

				db.user.findById(email.userId).then(function (user) {
					var script = '<script type="text/javascript">' +
							'localStorage.setItem("userId", ' + JSON.stringify(user.id) + ');' +
							'window.location.replace("' + config.resetRedirect + '");' +
							'</script>';

					res.html(response
							.replace(/\[\[subject\]\]/, 'Please wait...')
							.replace(/\[\[body\]\]/, script));
					next();

					db.touch(email);
				});
			});
	});
};
