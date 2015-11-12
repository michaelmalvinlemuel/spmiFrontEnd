(function(){
	'use strict'
	angular.module('spmiFrontEnd')
		.config(AdminRoute)
	
	function AdminRoute($stateProvider){
		$stateProvider.state('main.admin', {
			url:'admin',
			parent: 'main',
			views: {
				'@': {
					templateUrl: 'app/admin/dashboard/views/main.html',
					controller: 'AdminController as admin'
				},
				'content@main.admin': {
					templateUrl: 'app/admin/dashboard/views/dashboard.html',
					controller: 'AdminController as admin'
				}
			},
			data: {
				type: ['1']
			}
		})
	}
	
})();