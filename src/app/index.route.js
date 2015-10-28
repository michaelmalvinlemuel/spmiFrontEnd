(function() {
  'use strict';

  angular
    .module('spmiFrontEnd')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $httpProvider) {
	  
	$urlRouterProvider.otherwise('/');
	$httpProvider.defaults.cache = true;

	var promise = function ($rootScope, $q, $timeout, Authorization) {

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
		.state('home', {
			url: '/',
			templateUrl: 'app/main/main.html',
			controller: 'MainController',
			controllerAs: 'main'
      	})

    

	$stateProvider
		.state('main', {
			resolve: resolve,
			abstract: true,
			url: '',
			
		})

		.state('main.app', {
			url: '/',
			views: {
				'@': {
					templateUrl: 'app/views/main.html',
					controller: 'AppController'
				}
			},
			data: {
				type: ['1']
			},
		})

		.state('login', {
			url:'/login',
			views: {
				'': {
					templateUrl: 'app/views/login.html',
					controller: 'LoginController'
				}
			},
			data: {
				type: []
			},
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
			}

		})

	$stateProvider
		.state('register', {
			url:'/register',
			views: {
				'': {
					templateUrl: 'app/views/register.html',
					controller: 'RegisterController'
				}
			},
			data: {
				type: []
			},
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
			}

		})
		
		.state('error', {
			views: {
				'': {
					templateUrl: 'app/views/error.html'
				}
			},
			data: {
				type: []
			},
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
			}
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
					templateUrl: 'app/views/information.html',
					controller: 'InformationRegistrationController'
				}
			}
		})

	$stateProvider
		.state('main.admin', {
			url:'/admin',
			parent: 'main',
			views: {
				'@': {
					templateUrl: 'app/admin/views/main.html',
					controller: 'AdminController'
				},
				'content@main.admin': {
					templateUrl: 'app/admin/views/dashboard.html',
					controller: 'AdminController'
				}
			},
			data: {
				type: ['1']
			},
			resolve: resolve,
		
		})

	
		
		
		

		



		

	
		

		



		//Document
	
		


		//Organization
	
		




		




		




		



		




		




		



	

		.state('main.user', {
			url:'/user',
			views: {
				'@': {
					templateUrl: 'app/user/views/main.html',
					controller: 'EndUserController'
				}
			},
			data: {
				type: ['1','2']
			},
			resolve: resolve,
		})

		

		



		

		.state('main.denied', {
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
					templateUrl: 'app/views/denied.html',
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

		.state('main.notFound', {
			url: '/404',
			views: {
				'@': {
					template: '<h1>404 - Not Found</h1>'
				}
			}, 
			resolve: {
				Session: function() {
					return undefined;
				}
			}
		})
}

})();
