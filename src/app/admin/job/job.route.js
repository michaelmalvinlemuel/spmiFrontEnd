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
						controller: 'JobController',
						controllerAs: 'vm'
					}
				},
				resolve: {
					universities: function(UniversityService){
						return UniversityService.get()	
					}
				}
			})
	
			.state('main.admin.job.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/job/views/form.html',
						controller: 'CreateJobController as vm'
					}
				},
				resolve: {
					universities: function(UniversityService){
						return UniversityService.get()
					}
				}
			})
	
			.state('main.admin.job.update', {
				url: '/update/:jobId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/job/views/form.html',
						controller: 'UpdateJobController as vm'
					}
				},
				resolve: {
					job: function($stateParams, JobService){
						return JobService.show($stateParams.jobId);
					},
					universities: function(UniversityService){
						return UniversityService.get();
					},
				}
			})
	}

})();