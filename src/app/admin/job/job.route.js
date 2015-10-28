(function () {

	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', JobRoute])
	
	function JobRoute($stateProvider){
		$stateProvider
			.state('main.admin.job', {
				url: '/job',
				views: {
					'content': {
						templateUrl: 'app/admin/job/views/list.html',
						controller: 'JobController'
					}
				}
			})
	
			.state('main.admin.job.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/job/views/form.html',
						controller: 'CreateJobController'
					}
				}
			})
	
			.state('main.admin.job.update', {
				url: '/update/:jobId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/job/views/form.html',
						controller: 'UpdateJobController'
					}
				}
			})
	}

})();