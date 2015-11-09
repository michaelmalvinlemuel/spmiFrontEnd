(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.config(UniversityRoute)
	
	function UniversityRoute($stateProvider){
		$stateProvider
			.state('main.admin.university', {
				url: '/university',
				views: {
					'content': {
						templateUrl: 'app/admin/university/views/list.html',
						controller: 'UniversityController as vm',
					}
				},
				resolve: {
					universities: function(UniversityService){
						return UniversityService.get();
					}
				}
			})
	
			.state('main.admin.university.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/university/views/form.html',
						controller: 'CreateUniversityController as vm'
					}
				}
			})
	
			.state('main.admin.university.update', {
				url: '/:universityId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/university/views/form.html',
						controller: 'UpdateUniversityController as vm'
					}
				},
				resolve: {
					university: function($stateParams, UniversityService){
						return UniversityService.show($stateParams.universityId)
					}
				}
			})
	}

})();