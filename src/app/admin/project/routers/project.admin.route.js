(function () {
	'use strict'
	angular.module('spmiFrontEnd').config(AdminProjectRoute)
	
	function AdminProjectRoute($stateProvider){
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
						return ProjectService.get(10, true, true, true, true, true, true, 1);
					},
					isAdmin: function() {
						return true;
					},
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
						templateUrl: 'app/admin/project/views/detail.html',
						controller: 'UserProjectController as vm',
					},
				},
				resolve: {
					project: function($stateParams, ProjectService) {
						return ProjectService.showLast($stateParams.projectId);
					},
					isAdmin: function() { return true },
				},
			})
			
			.state('main.admin.project.scoring.assess', {
				url: '/assess/:nodeId',
				parent: 'main.admin.project.scoring',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/project/views/scoring.html',
						controller: 'ScoringProjectController as vm'
					},
				},
				resolve: {
					node: function($stateParams, ProjectService) {
						return ProjectService.assess($stateParams.nodeId);
					},
					isAdmin: function() { return true },
				},
			})
			
			.state('main.admin.project.detail', {
				url: '/detail/:projectId',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/project/views/detail.html',
						controller: 'ViewProjectController as vm'
					}
				},
				resolve: {
					project: function($stateParams, ProjectService){
						return ProjectService.showLast($stateParams.projectId);
					},
					mark: function() {
						return false;
					},
				}
			})
			
			.state('main.admin.project.detail.mark', {
				url: '/:mark',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/project/views/detail.html',
						controller: 'ViewProjectController as vm'
					}
				},
				resolve: {
					project: function($stateParams, ProjectService) {
						return ProjectService.showLast($stateParams.projectId);
					},
					mark: function($stateParams) {
						return $stateParams.mark;
					},
				}
			})
			
			
			
	}

})();