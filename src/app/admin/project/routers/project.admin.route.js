(function (angular) {
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
					templates: function(ProjectTemplateService) {
						return ProjectTemplateService.paginate(10, 1);
					},
					isAdmin: function() {
						return true;
					},
				}
			})
			
            .state('main.admin.project.template', {
                url: '/template',
                views: {
                    'content@main.admin': {
                        templateUrl: 'app/admin/project/views/list.template.html',
                        controller: 'ProjectController as vm'
                    }
                }
            })
            
			.state('main.admin.project.createTemplate', {
				url:'/template/create',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/project/views/detail.template.html',
						controller: 'CreateTemplateProjectController as vm',
					}
				}
			})
			
			.state('main.admin.project.updateTemplate', {
				url: '/template/:projectId',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/project/views/detail.template.html',
						controller: 'UpdateTemplateProjectController as vm',
					}
				},
				resolve: {
					project: function($stateParams, ProjectTemplateService) {
						return ProjectTemplateService.show($stateParams.projectId);
					}
				}
			})
	
			.state('main.admin.project.create', {
				url: '/create',
				parent: 'main.admin.project',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/project/views/detail.html',
						controller: 'AdminCreateProjectController as vm'
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

					departments: function(DepartmentService) {
						return DepartmentService.get();
					}
				}
			})
	
			.state('main.admin.project.update', {
				url: '/:projectId',
				parent: 'main.admin.project',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/project/views/detail.html',
						controller: 'AdminUpdateProjectController as vm'
					}
				},
				resolve: {
					projects: function($stateParams, ProjectService){
						return ProjectService.show($stateParams.projectId);
					},
					
					departments: function(DepartmentService) {
						return DepartmentService.get();
					}
				}
			})
            
            .state('main.admin.project.adjust', {
                url: '/adjust/:projectId',
                views: {
                    'content@main.admin': {
                        templateUrl: 'app/admin/project/views/detail.html',
                        controller: 'AdjustmentProjectController as vm',
                    }
                },
                resolve: {
                    project: function($stateParams, ProjectService) {
                        return ProjectService.showLast($stateParams.projectId);
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
                    completeness: function($stateParams, ProjectService) {
                        return ProjectService.count($stateParams.projectId);
                    }
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

})(angular);