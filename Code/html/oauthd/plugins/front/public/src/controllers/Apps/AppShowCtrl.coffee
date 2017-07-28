async = require 'async'

module.exports = (app) ->
	app.controller('AppShowCtrl', ['$state', '$scope', '$rootScope', '$location', '$modal', 'UserService', '$stateParams', 'AppService', 
		($state, $scope, $rootScope, $location, $modal, UserService, $stateParams, AppService) ->
			$scope.domains_control = {}
			$scope.error = undefined
			$scope.setProvider undefined
			$scope.backend = {}
			$scope.original_backend = {}
			$scope.changed = false


			$scope.$watch 'backend', () ->
				if not angular.equals $scope.backend, $scope.original_backend
					$scope.changed = true
				$scope.appModified(not angular.equals $scope.backend, $scope.original_backend)
			, true
			$scope.show_secret = false
			$scope.getAppInfo = (show_secret) ->
				$scope.show_secret = show_secret
				AppService.get($stateParams.key)
					.then (app) ->

						if not show_secret
							app.secret = '••••••••••••••••'
						$scope.app = app
						$scope.setApp app
						$scope.error = undefined
						$scope.$apply()
						$scope.domains_control.refresh()
					.fail (e) ->
						console.log e
						$scope.error = e.message
			
			$scope.getAppInfo(false)

			$scope.resetKeys = () ->
				if confirm 'Are you sure you want to reset this app\'s keys? This will break the code using these keys.'
					AppService.resetKeys($stateParams.key)
						.then (data) ->
							$state.go 'dashboard.apps.show', {
								key: data.key
							}
						.fail () ->
							console.log e
							$scope.error = e.message

			AppService.getBackend $stateParams.key
				.then (backend) ->
					$scope.original_backend = {}
					$scope.original_backend.name = backend?.name
					if not $scope.original_backend?.name
						$scope.original_backend.name = 'none'
					$scope.backend = {}
					for k,v of $scope.original_backend
						$scope.backend[k] = v
					console.log $scope.backend
					$scope.$apply()
				.fail (e) ->
					console.log e

			$scope.saveApp = () ->
				$scope.changed = false
				$scope.appModified false
				async.series [
					(cb) ->
						AppService.update($scope.app)
							.then () ->
								cb()
							.fail (e) ->
								console.log 'error', e
								$scope.error = e.message
								cb e
					(cb) ->	
						AppService.setBackend $stateParams.key, $scope.backend?.name
							.then () ->
								cb()
							.fail (e) ->
								cb e
				], (err) ->
					$scope.error = "A problem occured while saving the app" if err
					$scope.changed = true if err
					$scope.appModified true if err
					$scope.success = "Successfully saved changes"
					
					$scope.$apply()
 
			$scope.deleteApp = () ->
				if confirm 'Are you sure you want to delete this app?'
					AppService.del $scope.app
						.then () ->
							$state.go 'dashboard.apps.all'
							$scope.error = undefined
						.fail (e) ->
							console.log 'error', e
							$scope.error = e.message
			timeout = undefined
			$scope.$watch 'success', () ->
				clearTimeout timeout
				if $scope.success != undefined
					timeout = setTimeout () ->
						$scope.success = undefined
						$scope.$apply()
					, 3000


			timeoute = undefined
			$scope.$watch 'error', () ->
				clearTimeout timeoute
				if $scope.error != undefined
					timeoute = setTimeout () ->
						$scope.error = undefined
						$scope.$apply()
					, 3000

			$scope.domains_control.change = () ->
				$scope.changed = true
				$scope.appModified true
				$scope.$apply()

			$scope.tryAuth = (provider, key) ->
				OAuth.setOAuthdURL window.location.origin
				OAuth.initialize key

				type = 'client'
				type = 'baas' if $scope.app.backend?.name == 'firebase'
				type = 'server' if $scope.app.backend && $scope.app.backend.name != 'firebase'

				params = {}
				if type == 'server'
					params.state = 'azerty'
				OAuth.popup provider, params, (err, res) ->
					if err
						instance = $modal.open
							templateUrl: '/templates/dashboard/modals/try-error.html'
							controller: 'AppTryModalCtrl'
							resolve:
								success: -> return res
								err: -> return err
								provider: -> return provider
								key: -> return key
								type: -> return type
								backend: -> return $scope.app.backend?.name
						console.log err
						return false
					console.log res
					instance = $modal.open
						templateUrl: '/templates/dashboard/modals/try-success.html'
						controller: 'AppTryModalCtrl'
						resolve:
							success: -> return res
							err: -> return err
							provider: -> return provider
							key: -> return key
							type: -> return type
							backend: -> return $scope.app.backend?.name
			
	])	