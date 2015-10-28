(function () {

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
						controller: 'GroupJobController'
					}
				}
			})
	
			.state('main.admin.groupJob.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/groupJob/views/form.html',
						controller: 'CreateGroupJobController'
					}
				}
			})
	
			.state('main.admin.groupJob.update', {
				url: '/update/:groupJobId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/groupJob/views/form.html',
						controller: 'UpdateGroupJobController'
					}
				}
			})
	}

})();