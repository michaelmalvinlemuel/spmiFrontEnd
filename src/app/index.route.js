(function() {
  'use strict';

  angular
    .module('spmiFrontEnd')
    .config(RouterConfig);

  /** @ngInject */
  function RouterConfig($stateProvider, $urlRouterProvider) {
	  
	$urlRouterProvider.otherwise('/');
	
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
			params: {
				sender: null,	
			},
			views: {
				'': {
					templateUrl: 'app/register/register.html',
					controller: 'RegisterController as vm'
				}
			},
			data: {
				type: []
			},
			resolve: {
				redirect: function($stateParams, Authorization) {
					return Authorization.authenticatedRedirection($stateParams.sender)
				}
			},

		})
		
		.state('error', {
			views: {
				'': {
					templateUrl: 'app/components/pages/error.html'
				}
			},
			data: {
				type: []
			},
		})

		.state('register.information', {
			url: '/information',
			
			views: {
				'@': {
					templateUrl: 'app/components/pages/information.html',
					controller: function($scope, $auth, $state, CURRENT_USER) {
						$scope.logout = function(){
						$auth.logout().then(function(){
							CURRENT_USER = {}
							$state.go('login', {sender: 'system'});
						}, function (response) {})
					}
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
		        email: {},
				sender: null,
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
							UserService.logout()
								.then(function () {
									$state.go('login', {sender: 'system'});
								})
						}
					}
				}
			},
			data: {
				type: []
			},
			resolve: {
				redirect: function($stateParams, Authorization) {
					return Authorization.authenticatedRedirection($stateParams.sender)
				}
			},
		})

}

})();
