(function() {
  'use strict';

  angular
    .module('spmiFrontEnd')
    .config(RouterConfig);

  /** @ngInject */
  function RouterConfig($stateProvider, $urlRouterProvider) {
	  
	$urlRouterProvider.otherwise('/');
	var promise = function ($rootScope, $q, $timeout, Authorization) {
		
		console.log('1');
		
		var deferred = $q.defer();
		Authorization.authorize().then(function(response) {
			deferred.resolve(response)
		}, function(response) {
			deferred.reject(response)
		})
		return deferred.promise;
	}

	var resolve = {
		Session: promise
	}
	
	$stateProvider
		.state('main', {
			url: '/',
			templateUrl: 'app/main/main.html',
			controller: 'MainController as vm',
			resolve: {
				isAuthenticated: function(Authorization){
					return Authorization.isAuthenticated();
				}
			}
      	})
	
	$stateProvider
		.state('register', {
			url:'/register',
			views: {
				'': {
					templateUrl: 'app/register/register.html',
					controller: 'RegisterController as vm'
				}
			},
			data: {
				type: []
			}/*,
			resolve: {
				back: function($rootScope, $q, $state, UserService) {
					var deferred = $q.defer()

					UserService.identity()
						.then(function() {
							if($rootScope.toState.name == 'login' || $rootScope.toState.name == 'register') {
								deferred.resolve()
								$state.go($rootScope.fromState.name)
							}
							deferred.resolve()
						}, function() {
							deferred.resolve()
						})

					return deferred.promise
				}
			}*/

		})
		
		.state('error', {
			views: {
				'': {
					templateUrl: 'app/components/pages/error.html'
				}
			},
			data: {
				type: []
			}/*,
			resolve: {
				back: function($rootScope, $q, $state, UserService) {
					var deferred = $q.defer()

					UserService.identity()
						.then(function() {
							if($rootScope.toState.name == 'error') {
								deferred.resolve()
								$state.go($rootScope.fromState.name)
							}
							deferred.resolve()
						}, function() {
							deferred.resolve()
						})

					return deferred.promise
				}
			}*/
		})

		.state('register.information', {
			url: '/information',
			params: { 
		        // here we define default value for foo
		        // we also set squash to false, to force injecting
		        // even the default value into url
		        email: {
		          
		        },
		        // this param is not part of url
		        // it could be passed with $state.go or ui-sref 
		        hiddenParam: 'YES',
	      	},
			views: {
				'@': {
					templateUrl: 'app/components/pages/information.html',
					controller: function($scope, $stateParams) {
						$scope.email = $stateParams.email;
					}
				}
			}
		})

	

		

		



		

		.state('denied', {
			url: '/denies',
			params: { 
		        // here we define default value for foo
		        // we also set squash to false, to force injecting
		        // even the default value into url
		        email: {
		          
		        },
		        // this param is not part of url
		        // it could be passed with $state.go or ui-sref 
		        hiddenParam: 'YES',
	      	},
			views: {
				'@': {
					templateUrl: 'app/components/pages/denied.html',
					controller: function ($scope, $state, $stateParams, UserService) {
						$scope.email = $stateParams.email

						$scope.logout = function() {
							UserService
								.logout()
								.then(function () {
									$state.go('login');
								})
						}
					}
				}
			},
			data: {
				type: []
			}
		})

}

})();
