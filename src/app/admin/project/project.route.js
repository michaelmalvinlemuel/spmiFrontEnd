(function () {

	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', ProjectRoute])
	
	function ProjectRoute($stateProvider){
		$stateProvider
			.state('main.admin.project', {
				url: '/project',
				views: {
					'content': {
						templateUrl: 'app/admin/project/views/list.html',
						controller: 'ProjectController'
					}
				}
			})
	
			.state('main.admin.project.create', {
				url: '/create',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/project/views/detail.html',
						controller: 'CreateProjectController'
					}
				}
			})
	
			.state('main.admin.project.update', {
				url: '/update/:projectId',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/project/views/detail.html',
						controller: 'UpdateProjectController'
					}
				}
			})
	}

})();