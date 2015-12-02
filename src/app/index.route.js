(function() {
  'use strict';

  angular
    .module('spmiFrontEnd')
    .config(RouterConfig);

  /** @ngInject */
  function RouterConfig($stateProvider, $urlRouterProvider) {
	  
	$urlRouterProvider.otherwise('/');
	
	$stateProvider
		
		.state('window', {
			url:'',
		})
		
		.state('window.project', {
			url: '',
		})
		
		.state('window.project.error', {
			url: '/window',
			params: {
				sender: null,	
			},
			views: {
				'@': {
					templateUrl: 'app/components/window/errors.html',
					controller: '',
				}
			},
		})
		
		
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
		
		.state('register.information', {
			url: '/information',
			views: {
				'@': {
					templateUrl: 'app/components/pages/information.html',
					controller: function($scope, $auth, $state, CURRENT_USER, UserService) {
						
						$scope.resend = function() {
							UserService.resend().then(function(data) {
								alert('Permintaan token Anda sudah kami kirimkan via email. Silahkan di check');
							})
						}
						
						$scope.logout = function() {
							$auth.logout().then(function() {
								CURRENT_USER = {}
								$state.go('login', {sender: 'system'});
							}, function (response) {})
						}
						
					}
				}
			}
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
		
		.state('failure', {
			url: 'failure',
			params: {
				alert: {},
				sender: null,
			},
			views: {
				'': {
					templateUrl: 'app/components/pages/error.html',
					controller: function($scope, $state, $stateParams, UserService) {
						$scope.alert = $stateParams.alert;
					}
				}
			},
			resolve: {
				redirect: function($stateParams, Authorization) {
					return Authorization.authenticatedRedirection($stateParams.sender)
				}
			},
		})

		


		.state('denied', {
			url: '/denies',
			params: { 
		        email: {},
				sender: null,
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
