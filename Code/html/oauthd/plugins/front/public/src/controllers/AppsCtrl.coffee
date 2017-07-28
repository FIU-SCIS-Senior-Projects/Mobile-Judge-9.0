module.exports = (app) ->
	app.controller('AppsCtrl', ['$state', '$scope', '$rootScope', '$location',
		($state, $scope, $rootScope, $location, UserService) ->
			$scope.setApp = (app) ->
				$scope.app = app


			$scope.getApp = () ->
				return $scope.app

			$scope.setProvider = (provider) ->
				$scope.provider_name = provider
			$scope.setTitle = (title) ->
				$scope.pagetitle = title

			$scope.clearArianne = () ->
				$scope.app = undefined
				$scope.provider_name = undefined
				# $scope.$apply()

			$scope.appModified = (v) ->
				$scope.app_changed = v


			
	])
