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
						controller: 'ProjectController as vm'
					}
				},
				resolve: {
					projects: function(ProjectService){
						return ProjectService.get();
					}
				}
			})
	
			.state('main.admin.project.create', {
				url: '/create',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/project/views/detail.html',
						controller: 'CreateProjectController as vm'
					}
				},
			})
	
			.state('main.admin.project.update', {
				url: '/:projectId',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/project/views/detail.html',
						controller: 'UpdateProjectController as vm'
					}
				},
				resolve: {
					projects: function($stateParams, ProjectService){
						return ProjectService.show($stateParams.projectId);
					}
				}
				
			})
	}

})();