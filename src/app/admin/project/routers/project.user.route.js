(function () {
	'use strict'
	
	angular.module('spmiFrontEnd').config(UserProjectRoute)
	
	function UserProjectRoute($stateProvider){
		$stateProvider
			.state('main.user.project', {
				url: '/project',
				views: {
					'content': {
						templateUrl: 'app/admin/project/views/list.html',
						controller: 'ProjectController as vm'
					}
				},
				resolve: {
					projects: function ( ProjectService ) {
						return ProjectService.user(10, true, true, true, true, true, true, 1);
					},
					isAdmin: function() {
						return false;
					},
				}
			})
	
			.state('main.user.project.detail', {
				url: '/detail/:projectId',
				views: {
					'content@main.user': {
						templateUrl: 'app/admin/project/views/detail.html',
						controller: 'UserProjectController as vm'
					}
				},
				resolve: {
					project: function ($stateParams, ProjectService) {
						return ProjectService.showLast($stateParams.projectId);
					},
					isAdmin: function() { return false },
				}
			})
			
			.state('main.user.project.detail.assess', {
				url: '/assess/:nodeId',
				views: {
					'content@main.user': {
						templateUrl: 'app/admin/project/views/scoring.html',
						controller: 'ScoringProjectController as vm'
					},
				},
				resolve: {
					node: function($stateParams, ProjectService) {
						return ProjectService.assess($stateParams.nodeId);
					},
					isAdmin: function() { return false },
				},
			})
			
			.state('main.user.project.detail.form', {
				url: '/upload/:formId',
				views: {
					'content@main.user': {
						templateUrl: 'app/admin/project/views/upload.html',
						controller: 'FormDetailUserProjectController as vm'
					}
				},
				resolve: {
					form: function($stateParams, ProjectService) {
						return ProjectService.form($stateParams.formId);
					},
					project: function($stateParams, ProjectService) {
						return ProjectService.leader($stateParams.projectId)
					},
				},
			})
	}

})();