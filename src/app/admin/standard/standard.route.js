(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', StandardRoute])
	
	function StandardRoute($stateProvider){
		$stateProvider
			.state('main.admin.standard', {
				url: '/standard',
				views: {
					'content': {
						templateUrl: 'app/admin/standard/views/list.html',
						controller: 'StandardController as vm'
					}
				},
				resolve: {
					standards: function(StandardService){
						return StandardService.get();
					}
				}
			})
	
			.state('main.admin.standard.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/standard/views/form.html',
						controller: 'CreateStandardController as vm'
					}
				}
			})
	
			.state('main.admin.standard.update', {
				url: '/:standardId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/standard/views/form.html',
						controller: 'UpdateStandardController as vm'
					}
				},
				resolve: {
					standard: function($stateParams, StandardService){
						return StandardService.show($stateParams.standardId)
					}
				}
			})
	}

})();