(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', DepartmentRouter])
	
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
	}

})();