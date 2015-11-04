(function () {

	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', SemesterRoute])
	
	function SemesterRoute($stateProvider){
		$stateProvider
			.state('main.admin.semester', {
				url: '/semester',
				views: {
					'content': {
						templateUrl: 'app/admin/semester/views/list.html',
						controller: 'SemesterController as vm'
					}
				},
				resolve: {
					semesters: function(SemesterService){
						return SemesterService.get();
					}
				}
			})
	
			.state('main.admin.semester.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/semester/views/form.html',
						controller: 'CreateSemesterController as vm'
					}
				}
			})
	
			.state('main.admin.semester.update', {
				url: '/update/:semesterId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/semester/views/form.html',
						controller: 'UpdateSemesterController as vm'
					}
				},
				resolve: {
					semester: function($stateParams, SemesterService){
						return SemesterService.show($stateParams.semesterId)
					}
				}
			})
	}

})();