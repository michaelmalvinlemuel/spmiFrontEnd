(function() {
	
	'use strict';
	
	angular.module('spmiFrontEnd')
		.config(WindowProjectRouter)
	
	function WindowProjectRouter($stateProvider) {
		
		$stateProvider
			.state('window', {
				url: '/window',
			})
		
			.state('window.project', {
				url: '/project',
			})
			
			.state('window.project.error', {
				url: '/error',
				views: {
					'@': {
						templateUrl: 'app/admin/project/window/project.window.html',
						controller:'WindowProjectController',
						controllerAs: 'vm',
					}
				}
			})
	}
	
})();