(function() {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.config(LoginRoute)
		
	function LoginRoute($stateProvider){
		$stateProvider
			.state('login', {
				url:'/login',
				params: {
					alert: {},
					sender: null,
				},
				views: {
					'': {
						templateUrl: 'app/login/login.html',
						controller: 'LoginController as vm'
					}
				},
				data: {
					type: []
				},
				resolve: {
					redirect: function($stateParams, Authorization) {
						return Authorization.authenticatedRedirection($stateParams.sender)
					}
				}
	
			})
	}
})();