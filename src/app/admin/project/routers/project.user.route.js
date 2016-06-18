(function (angular) {
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
						return ProjectService.member(10, true, true, true, true, true, true, 1);
					},
					isAdmin: function() {
						return false;
					},
					templates: function() {
						return [];
					}
				}
			})
			
			.state('main.user.project.create', {
				url: '/create',
				parent: 'main.user.project',
				views: {
					'content@main.user': {
						templateUrl: 'app/admin/project/views/detail.html',
						controller: 'UserCreateProjectController as vm',
					}
				},
				resolve: {
					template: function(ProjectTemplateService, $q, $modal) {
						var deferred = $q.defer();
						
						function modalStart() {
							var modalInstance = $modal.open({
								animate: false,
								templateUrl: 'app/admin/project/views/template.modal.html',
								controller: 'ModalTemplateProjectController as vm',
								size: 'lg',
								resolve: {
									
								}
									
							})
							
							modalInstance.result.then(function(template) {
								ProjectTemplateService.show(template.id)
									.then(function(data) {
										deferred.resolve(data)
									})
								
							})
						}
						modalStart();
						
						return deferred.promise;
					},
				}
			})
			
			.state('main.user.project.update', {
				url: '/:projectId',
				parent: 'main.user.project',
				views: {
					'content@main.user': {
						templateUrl: 'app/admin/project/views/detail.html',
						controller: 'UserUpdateProjectController as vm'
					}
				},
				resolve: {
					projects: function($stateParams, ProjectService){
						return ProjectService.show($stateParams.projectId);
					},
				}
			})
            
            
            
            
            .state('main.user.projectAssess', {
				url: '/project-assess',
				views: {
					'content': {
						templateUrl: 'app/admin/project/views/list.assessor.html',
						controller: 'AssessorListProjectController as vm'
					}
				},
				resolve: {
					projects: function ( ProjectService ) {
						return ProjectService.assessor(10, true, true, true, true, true, true, 1);
					},
				}
			})
            
            .state('main.user.projectAssess.detail', {
                url: '/:projectId',
                views: {
                    'content@main.user': {
                        templateUrl: 'app/admin/project/views/detail.assessor.html',
						controller: 'AssessorDetailProjectController as vm'
                    }
                },
                resolve: {
                    project: function ($stateParams, ProjectService) {
                        return ProjectService.formAssess($stateParams.projectId);
					},
                    completeness: function($stateParams, ProjectService) {
                        return ProjectService.count($stateParams.projectId);
                    }
                }
            })
            
            .state('main.user.projectAssess.detail.assess', {
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
					isAdmin: function() { 
                        return false 
                    },
                    completeness: function($stateParams, ProjectService) {
                        return ProjectService.count($stateParams.projectId);
                    }
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

})(angular);