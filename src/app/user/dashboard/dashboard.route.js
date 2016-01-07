(function(angular){
	
	'use strict';
	
	angular.module('spmiFrontEnd')
		.config(EndUserRoute)
		
	function EndUserRoute($stateProvider){
	
		$stateProvider.state('main.user', {
			url:'user',
			parent: 'main',
			views: {
				'@': {
					templateUrl: 'app/user/dashboard/views/main.html',
					controller: 'EndUserController as user'
				},
				'content@main.user': {
					templateUrl: 'app/user/dashboard/views/dashboard.html',
					controller: 'EndUserController as user',
				}
			},
			data: {
				type: ['1','2']
			}
		})
	}
	
})(angular);