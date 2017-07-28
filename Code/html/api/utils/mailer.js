var nodemailer = require('nodemailer'),
	sendmailTransport = require('nodemailer-sendmail-transport'),
	inlineBase64 = require('nodemailer-plugin-inline-base64'),
	config = require('../config/server.json'),
	transporter = nodemailer.createTransport(sendmailTransport(config.sendmail));
	transporter.use('compile', inlineBase64);

module.exports = transporter;
