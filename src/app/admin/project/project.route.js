(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.config(ProjectRoute)
	
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
			
			.state('main.admin.project.scoring', {
				url: '/scoring/:projectId',
				views: {
					'content@main.admin': {
						templateUrl: 'app/user/project/views/detail.html',
						controller: 'ScoringProjectController as vm',
					},
				},
				resolve: {
					projects: function($stateParams, ProjectService) {
						return ProjectService.showLast($stateParams.projectId);
					},
				},
			})
			
			.state('main.admin.project.detail', {
				url: '/detail/:projectId',
				views: {
					'content@main.admin': {
						templateUrl: 'app/user/project/views/detail.html',
						controller: 'DetailProjectController as vm'
					}
				},
				resolve: {
					project: function($stateParams, ProjectService){
						return ProjectService.show($stateParams.projectId);
					}
				}
			})
	}

})();