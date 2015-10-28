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
						controller: 'DepartmentController'
					}
				}
			})
	
			.state('main.admin.department.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/department/views/form.html',
						controller: 'CreateDepartmentController'
					}
				}
			})
	
			.state('main.admin.department.update', {
				url: '/update/:departmentId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/department/views/form.html',
						controller: 'UpdateDepartmentController'
					}
				}
			})
	}

})();