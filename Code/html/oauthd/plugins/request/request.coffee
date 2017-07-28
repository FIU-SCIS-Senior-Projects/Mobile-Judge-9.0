# OAuth daemon
# Copyright (C) 2013 Webshell SAS
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.

async = require 'async'
qs = require 'querystring'
Url = require 'url'
restify = require 'restify'
request = require 'request'

furtherEncodeUri = (string) ->
	string = string.replace /\!/g, '%21'
	string = string.replace /\*/g, '%2A'
	string = string.replace /\(/g, '%28'
	string = string.replace /\)/g, '%29'
	string = string.replace /\'/g, '%27'
	return string

module.exports = (env) ->
	env.middlewares.request = {}
	env.middlewares.request.all = []
	# Chain of middlewares that are applied to each Request endpoints
	createMiddlewareChain = () ->
		(req, res, next) ->
			chain = []
			i = 0
			for k, middleware of env.middlewares.request.all
				do (middleware) ->
					chain.push (callback) ->
						middleware req, res, callback
			if chain.length == 0
				return next()
			async.waterfall chain, () ->
				next()

	middlewares_request_chain = createMiddlewareChain()

	oauth = env.utilities.oauth

	exp = {}
	exp.apiRequest = (req, provider_name, oauthio, callback) =>
		req.headers ?= {}
		async.parallel [
			(callback) => env.data.providers.getExtended provider_name, callback
			(callback) => env.data.apps.getKeyset oauthio.k, provider_name, callback
		], (err, results) =>
			return callback err if err
			[provider, {parameters}] = results

			# select oauth version
			oauthv = oauthio.oauthv && {
				"2":"oauth2"
				"1":"oauth1"
			}[oauthio.oauthv]
			if oauthv and not provider[oauthv]
				return callback new env.utilities.check.Error "oauthio_oauthv", "Unsupported oauth version: " + oauthv

			oauthv ?= 'oauth2' if provider.oauth2
			oauthv ?= 'oauth1' if provider.oauth1

			parameters.oauthio = oauthio

			env.events.emit 'request', provider:provider_name, key:oauthio.k

			# let oauth modules do the request
			oa = new oauth[oauthv](provider, parameters)
			oa.request req, callback

	fixUrl = (ref) -> ref.replace /^([a-zA-Z\-_]+:\/)([^\/])/, '$1/$2'

	env.middlewares.request.credentialsNeeded = (req, res, next) ->

		oauthio = qs.parse req.headers.oauthio
		req.headers.oauthio = qs.parse req.headers.oauthio

		if ! oauthio
			return res.send new env.utilities.check.Error "You must provide a valid 'oauthio' http header"
		oauthio = qs.parse(oauthio)
		if ! oauthio.k
			return res.send new env.utilities.check.Error "oauthio_key", "You must provide a 'k' (key) in 'oauthio' header"

		origin = null
		ref = fixUrl(req.headers['referer'] || req.headers['origin'] || "http://localhost");
		urlinfos = Url.parse(ref)
		if not urlinfos.hostname
			ref = origin = "http://localhost"
		else
			origin = urlinfos.protocol + '//' + urlinfos.host
		res.setHeader 'Access-Control-Allow-Origin', origin
		res.setHeader 'Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'

		next()

	exp.allowOriginAndMethods = (url) ->
		env.server.opts url, (req, res, next) ->
			origin = null
			ref = fixUrl(req.headers['referer'] || req.headers['origin'] || "http://localhost");
			urlinfos = Url.parse(ref)
			if not urlinfos.hostname
				return next new restify.InvalidHeaderError 'Missing origin or referer.'
			origin = urlinfos.protocol + '//' + urlinfos.host

			res.setHeader 'Access-Control-Allow-Origin', origin
			res.setHeader 'Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'
			if req.headers['access-control-request-headers']
				res.setHeader 'Access-Control-Allow-Headers', req.headers['access-control-request-headers']
			res.cache maxAge: 120

			res.send 200
			next false

	exp.raw = ->

		fixUrl = (ref) -> ref.replace /^([a-zA-Z\-_]+:\/)([^\/])/, '$1/$2'

		doRequest = (req, res, next) =>

			cb = env.server.send(res, next)
			oauthio = req.headers.oauthio
			if ! oauthio
				return cb new env.utilities.check.Error "You must provide a valid 'oauthio' http header"
			oauthio = qs.parse(oauthio)
			if ! oauthio.k
				return cb new env.utilities.check.Error "oauthio_key", "You must provide a 'k' (key) in 'oauthio' header"

			origin = null
			ref = fixUrl(req.headers['referer'] || req.headers['origin'] || "http://localhost");
			urlinfos = Url.parse(ref)
			if not urlinfos.hostname
				ref = origin = "http://localhost"
			else
				origin = urlinfos.protocol + '//' + urlinfos.host

			req.apiUrl = decodeURIComponent(req.params[1])

			env.data.apps.checkDomain oauthio.k, ref, (err, domaincheck) =>
				return cb err if err
				if ! domaincheck
					return cb new env.utilities.check.Error 'Origin "' + ref + '" does not match any registered domain/url on ' + env.config.url.host

			exp.apiRequest req, req.params[0], oauthio, (err, options) =>
				return cb err if err
				delete options.headers["Cookie"]
				delete options.headers["X-Requested-With"]
				api_request = null

				sendres = ->
					api_request.pipefilter = (response, dest) ->
						dest.setHeader 'Access-Control-Allow-Origin', origin
						dest.setHeader 'Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'
					api_request.pipe(res)
					api_request.once 'end', -> next false
				content_type = req.headers['content-type']
				if req.headers['content-type']? and req.headers['content-type'].indexOf('application/x-www-form-urlencoded') != -1
					bodyParser = restify.bodyParser mapParams:false
					bodyParser[0] req, res, -> bodyParser[1] req, res, ->
						options.headers['Content-type'] = 'application/x-www-form-urlencoded'
						options.body = furtherEncodeUri(qs.stringify req.body)
						delete options.headers['Content-Length']
						api_request = request options
						sendres()
				else if req.headers['content-type']? and req.headers['content-type'].indexOf('application/json') != -1
					bodyParser = restify.bodyParser mapParams:false
					bodyParser[0] req, res, -> bodyParser[1] req, res, ->
						options.headers['Content-Type'] = content_type
						options.body = JSON.stringify(req.body)
						delete options.headers['Content-Length']
						api_request = request options
						sendres()
				else
					api_request = request options
					req.headers = {}
					api_request = req.pipe(api_request)
					sendres()



		# request's endpoints
		env.server.opts new RegExp('^' + env.config.base + '/request/([a-zA-Z0-9_\\.~-]+)/(.*)$'), (req, res, next) ->
			origin = null
			ref = fixUrl(req.headers['referer'] || req.headers['origin'] || "http://localhost");
			urlinfos = Url.parse(ref)
			if not urlinfos.hostname
				return next new restify.InvalidHeaderError 'Missing origin or referer.'
			origin = urlinfos.protocol + '//' + urlinfos.host

			res.setHeader 'Access-Control-Allow-Origin', origin
			res.setHeader 'Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'
			if req.headers['access-control-request-headers']
				res.setHeader 'Access-Control-Allow-Headers', req.headers['access-control-request-headers']
			res.cache maxAge: 120

			res.send 200
			next false

		env.server.get new RegExp('^' + env.config.base + '/request/([a-zA-Z0-9_\\.~-]+)/(.*)$'), middlewares_request_chain, doRequest
		env.server.post new RegExp('^' + env.config.base + '/request/([a-zA-Z0-9_\\.~-]+)/(.*)$'), middlewares_request_chain, doRequest
		env.server.put new RegExp('^' + env.config.base + '/request/([a-zA-Z0-9_\\.~-]+)/(.*)$'), middlewares_request_chain, doRequest
		env.server.patch new RegExp('^' + env.config.base + '/request/([a-zA-Z0-9_\\.~-]+)/(.*)$'), middlewares_request_chain, doRequest
		env.server.del new RegExp('^' + env.config.base + '/request/([a-zA-Z0-9_\\.~-]+)/(.*)$'), middlewares_request_chain, doRequest
	exp
