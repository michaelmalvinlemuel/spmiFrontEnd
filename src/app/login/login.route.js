(function() {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.config(LoginRoute)
		
	function LoginRoute($stateProvider){
		$stateProvider
			.state('login', {
				url:'/login',
				views: {
					'': {
						templateUrl: 'app/login/login.html',
						controller: 'LoginController as vm'
					}
				},
				data: {
					type: []
				},
				/*
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
				*/
	
			})
	}
})();