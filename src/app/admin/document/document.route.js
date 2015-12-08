(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.config(DepartmentRouter)
	
	function DepartmentRouter($stateProvider){
		$stateProvider
			.state('main.admin.document', {
				url: '/document',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/document/views/list.html',
						controller: 'DocumentController',
						controllerAs: 'vm',
					}
				}, 
				resolve:{
					documents: function(StandardService){
						return StandardService.getAll()
					}
				}
			})
			
			.state('main.user.document', {
				url: '/document',
				views: {
					'content@main.user': {
						templateUrl: 'app/admin/document/views/list.html',
						controller: 'DocumentController',
						controllerAs: 'vm',
					}
				}, 
				resolve:{
					documents: function(StandardService){
						return StandardService.getAll()
					}
				}
			})
	}

})();