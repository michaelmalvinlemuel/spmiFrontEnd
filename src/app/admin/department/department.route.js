(function () {

	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', DepartmentRouter])
	
	function DepartmentRouter($stateProvider){
		$stateProvider
			.state('main.admin.department', {
				url: '/department',
				views: {
					'content': {
						templateUrl: 'app/admin/department/views/list.html',
						controller: 'DepartmentController as vm'
					}
				},
				resolve: {
					departments: function(DepartmentService){
						return DepartmentService.get();
					}
				}
			})
	
			.state('main.admin.department.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/department/views/form.html',
						controller: 'CreateDepartmentController as vm'
					}
				},
				resolve: {
					universities: function(UniversityService){
						return UniversityService.get();
					}
				}
			})
	
			.state('main.admin.department.update', {
				url: '/update/:departmentId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/department/views/form.html',
						controller: 'UpdateDepartmentController as vm'
					}
				},
				resolve: {
					department: function($stateParams, DepartmentService){
						return DepartmentService.show($stateParams.departmentId);
					},
					universities: function(UniversityService){
						return UniversityService.get();
					},
					departments: function(DepartmentService){
						return DepartmentService.get();
					}
				}
			})
	}

})();