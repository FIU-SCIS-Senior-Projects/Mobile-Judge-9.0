# OAuth daemon
# Copyright (C) 2015 Webshell SAS
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
zlib = require 'zlib'
fs = require 'fs'
Stream = require 'stream'

module.exports = (env) ->
	oauth = env.utilities.oauth

	fixUrl = (ref) -> ref.replace /^([a-zA-Z\-_]+:\/)([^\/])/, '$1/$2'
	env.middlewares.slashme = {}
	env.middlewares.slashme.all = []
	# Chain of middlewares that are applied to each Slashme endpoints
	createMiddlewareChain = () ->
		(req, res, next) ->
			chain = []
			i = 0
			for k, middleware of env.middlewares.slashme.all
				do (middleware) ->
					chain.push (callback) ->
						middleware req, res, callback
			if chain.length == 0
				return next()
			async.waterfall chain, () ->
				next()

	middlewares_slashme_chain = createMiddlewareChain()

	AbsentFeatureError = (feature) ->
		return new env.utilities.check.Error "This provider does not support the " + feature + " feature yet"

	cors_middleware = (req, res, next) ->
		oauthio = req.headers.oauthio
		if ! oauthio
			return env.utilities.check.Error "You must provide a valid 'oauthio' http header"
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
		res.setHeader 'Access-Control-Allow-Origin', origin
		res.setHeader 'Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'
		next()

	fieldMap = (body, map_array, filter) ->
		result = {}
		for k of map_array
			field = map_array[k]
			if !filter || k in filter
				if typeof field == 'string'
					if field == '='
						result[k] = body[k]
					else
						result[k] = body[field]
				else if typeof field == 'function'
					result[k] = field(body)
		result.raw = if result.raw then result.raw else body
		return result

	exp = {}
	exp.raw = ->
		fixUrl = (ref) -> ref.replace /^([a-zA-Z\-_]+:\/)([^\/])/, '$1/$2'

		check = env.utilities.check
		env.server.opts new RegExp('^' + env.config.base + '/auth/([a-zA-Z0-9_\\.~-]+)/me$'), (req, res, next) =>

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

		env.plugins.slashme.me = (provider, oauthio, filter, callback) ->
			env.data.providers.getMeMapping provider, (err, content) =>
				if !err
					if content.url
						env.plugins.request.apiRequest {apiUrl: content.url, headers: { 'User-Agent': 'Node' } }, provider, oauthio, (err, options) =>
							return callback AbsentFeatureError('me()') if err
							options.json = true
							options.method ?= 'GET'
							request options, (err, response, body) =>
								return callback AbsentFeatureError('me()') if err
								# parsing body and mapping values to common field names, and sending the result
								return callback null, fieldMap(body, content.fields, filter)
					else if content.fetch
						user_fetcher = {}
						apiRequest = env.plugins.request.apiRequest
						async.eachSeries content.fetch, (item, cb) ->
							if typeof item == 'object'
								url = item.url
								apiRequest {apiUrl: item.url, headers: { 'User-Agent': 'Node' } }, provider, oauthio, (err, options) =>
									return callback AbsentFeatureError('me()') if err
									options.json = true
									options.method ?= 'GET'
									rq = request options, (err, response, body) =>
										for k of item.export
											value = item.export[k](body)
											user_fetcher[k] = value
										cb()
									chunks = []
									rq.on 'response', (rs) ->
										rs.on 'data',  (chunk) ->
											chunks.push chunk
										rs.on 'end', ->
											buffer = Buffer.concat chunks
											if rs.headers['content-encoding'] == 'gzip'
												zlib.gunzip buffer, (err, decoded) ->
													return callback err if err
													body = JSON.parse decoded.toString()
													for k of item.export
														value = item.export[k](body)
														user_fetcher[k] = value
														cb()
											else
												body = JSON.parse buffer.toString()
												for k of item.export
													value = item.export[k](body)
													user_fetcher[k] = value
													cb()
							if typeof item == 'function'
								url = item(user_fetcher)
								apiRequest {apiUrl: url, headers: { 'User-Agent': 'Node' } }, provider, oauthio, (err, options) =>
									return callback AbsentFeatureError('me()') if err
									options.json = true
									options.method ?= 'GET'
									delete options.headers['accept-encoding']
									rq = request options
									chunks = []
									rq.on 'response', (rs) ->
										rs.on 'data', (chunk) ->
											chunks.push chunk
										rs.on 'end', ->
											buffer = Buffer.concat chunks
											if rs.headers['content-encoding'] == 'gzip'
												zlib.gunzip buffer, (err, decoded) ->
													return callback err if err
													try
														body = JSON.parse decoded.toString()
													catch e
														return callback e if e
													return callback null, fieldMap(body, content.fields, filter)
											else
												try
													body = JSON.parse buffer.toString()
												catch e
													return callback e if e
												return callback null, fieldMap(body, content.fields, filter)

						, ->
					else
						return callback AbsentFeatureError('me()')
				else
					return callback AbsentFeatureError('me()')


		env.server.get new RegExp('^' + env.config.base + '/auth/([a-zA-Z0-9_\\.~-]+)/me$'), restify.queryParser(), cors_middleware, middlewares_slashme_chain, (req, res, next) =>
			cb = env.server.send res, next
			provider = req.params[0]
			filter = req.query.filter
			filter = filter?.split ','
			oauthio = req.headers.oauthio
			if ! oauthio
				return cb new Error "You must provide a valid 'oauthio' http header"
			oauthio = qs.parse(oauthio)
			if ! oauthio.k
				return cb new Error "oauthio_key", "You must provide a 'k' (key) in 'oauthio' header"

			env.plugins.slashme.me provider, oauthio, filter, (err, me) ->
				return next err if err
				res.send me
				next()


	return exp
