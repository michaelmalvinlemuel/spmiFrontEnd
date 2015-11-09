(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.config(WorkRoute)
	
	function WorkRoute($stateProvider){
		$stateProvider
			.state('main.admin.work', {
				url: '/work',
				views: {
					'content': {
						templateUrl: 'app/admin/work/views/list.html',
						controller: 'WorkController as vm'
					}
				},
				resolve: {
					works: function(WorkService){
						return WorkService.get()
					}
				}
			})
	
			.state('main.admin.work.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/work/views/form.html',
						controller: 'CreateWorkController as vm'
					}
				},
				resolve: {
					groupJobs: function(GroupJobService){
						return GroupJobService.get();
					}
				}
			})
	
			.state('main.admin.work.update', {
				url: '/:workId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/work/views/form.html',
						controller: 'UpdateWorkController as vm'
					}
				},
				resolve: {
					work: function($stateParams, WorkService){
						return WorkService.show($stateParams.workId)
					},
					groupJobs: function(GroupJobService){
						return GroupJobService.get();
					}
				}
			})
	}

})();