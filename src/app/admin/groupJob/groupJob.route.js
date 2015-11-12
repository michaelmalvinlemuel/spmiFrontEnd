(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', GroupJobRoute])
	
	function GroupJobRoute($stateProvider){
		$stateProvider
			.state('main.admin.groupJob', {
				url: '/groupJob',
				views: {
					'content': {
						templateUrl: 'app/admin/groupJob/views/list.html',
						controller: 'GroupJobController as vm'
					}
				},
				resolve: {
					groupJobs: function(GroupJobService){
						return GroupJobService.get()
					}
				}
			})
	
			.state('main.admin.groupJob.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/groupJob/views/form.html',
						controller: 'CreateGroupJobController as vm'
					}
				}
			})
	
			.state('main.admin.groupJob.update', {
				url: '/:groupJobId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/groupJob/views/form.html',
						controller: 'UpdateGroupJobController as vm'
					}
				},
				resolve: {
					groupJob: function($stateParams, GroupJobService){
						return GroupJobService.show($stateParams.groupJobId)
					}
				}
			})
	}

})();