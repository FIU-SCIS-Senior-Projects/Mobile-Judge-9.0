var http = require('http'),
	_ = require('lodash');

module.exports = function(restify) {

	function helper(regex, mime) {
		return function(code, object, headers) {
			if (!regex.test(this.header('content-type'))) {
				this.header('Content-Type', mime);
			}
			return (this.send(code, object, headers));
		};
	}

	_.extend(http.ServerResponse.prototype, {
		text: helper(/text\/plain/, 'text/plain'),
		html: helper(/text\/html/, 'text/html')
	});

	return {
		'text/html': restify.formatters['text/plain; q=0.3']
	};
};
