Q = require('q')

module.exports = (app) ->
	app.factory('UserService', ['$http', '$rootScope', '$location', 
		($http, $rootScope, $location) ->
			api = require('../utilities/apiCaller') $http, $rootScope
			user_service =
				login: (user) ->
					defer = Q.defer()
					authorization = window.btoa(user?.email + ':' + user?.pass)
					$http({
						method: 'POST',
						url: '/signin',
						data: {
							name: user.email,
							pass: user.pass
						}
					})
						.success((data) ->
							data = data.data
							$rootScope.accessToken = data.accessToken
							$rootScope.loginData = {
								token: data.accessToken,
								expires: data.expires
							}

							defer.resolve(data)
						)
						.error((e) ->
							defer.reject(e)
						)
					return defer.promise
				
				loggedIn: () ->
					$rootScope.wd.oauthio != undefined && $rootScope.wd.oauthio.access_token != undefined 
				logout: () ->
					$rootScope.logged_user = undefined
					$rootScope.accessToken = undefined
					$location.path('/login')

			user_service
	])
