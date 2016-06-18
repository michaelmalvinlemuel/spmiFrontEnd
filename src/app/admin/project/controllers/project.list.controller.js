(function(angular) {
    
	'use strict';
    
	angular.module('spmiFrontEnd')
		.controller('ProjectController', ProjectController)
	
	function ProjectController ($state, $timeout, projects, templates, isAdmin, ProjectService, ProjectTemplateService, ProjectConverterService, ProjectPaginationService) {
		var vm = this;
		vm.isAdmin = isAdmin;
		vm.projects = projects.data;
		vm.templates = templates.data;
		vm.total = projects.total;
		vm.totalTemplate = templates.total;
		
		
		//determine what kind of api service for use
		if (isAdmin == true) {
			vm.service = ProjectService.get;
		} else {
			vm.service = ProjectService.member;
		}
		
		ProjectPaginationService.listCtrl(vm);
		ProjectPaginationService.listTemplateCtrl(vm);
		
		
		vm.destroyTemplate = function(id, index) {
			
		}
		
		
		
		vm.detail = function (id) {
			$state.go('main.admin.project.detail', {projectId: id});
		}
		
		vm.update = function (id) {
			$state.go('main.admin.project.update', {projectId: id})
		};
		
		vm.updateTemplate = function(id) {
			$state.go('main.admin.project.updateTemplate', {projectId: id});
		}
		
        vm.adjust = function (id) {
            $state.go('main.admin.project.adjust', { projectId: id });
        }
        
		vm.scoring = function (id) {
			$state.go('main.admin.project.scoring', {projectId: id})
		}
		
		vm.mark = function(projectId, index, status) {
			
			$state.go('main.admin.project.detail.mark', { 
				projectId: projectId,
				mark: status,
			})
			
		}
	
		vm.destroy = function(id, index) {
			var cnf = confirm('Apakah anda yakin ingin menghapus project ini?');
			(cnf == true) ? ProjectService.destroy(id).then(function(){
				vm.projects.splice(index, 1);
			}) : null;
		};
		
		vm.destroyTemplate = function(id, index) {
			var cnf = confirm('Apakah anda yakin ingin menghapus project template ini?');
			(cnf == true) ? ProjectTemplateService.destroy(id).then(function(){
				vm.templates.splice(index, 1);
			}) : null;
		}
		
		vm.showStatus = function(start, ended, status) {
			var now = new Date();
			
			start = new Date(start);
			ended = new Date(ended);
			
			if (status == 0) {
				return {
					code: 0,
					text : 'Pending',
				}
			}
			
			if (start > now && status == 1) {
				return {
					code: 1,
					text : 'Preparation',
				}
			}
			
			if (start <= now && ended >= now && status == 1) {
				return { 
					code: 2,
					text: 'On Progress',
				}
			}
			
			if (ended < now && status == 1) {
				return {
					code: 3,
					text: 'Waiting for Scoring',
				};
			}
			
			if (status == 2) {
				return {
					code: 4,
					text: 'Completed',
				};
			}
			
			if (status == 3) {
				return {
					code: 5,
					text: 'Terminated',
				};
			}
		}
		
		vm.disabledModify = function(code) {
			if (code == 0 || code == 1) {
				return false;
			} else {
				return true;
			}
		}
		
		vm.disabledScoring = function(code) {
			if (code == 2 || code == 3) {
				return false;
			} else {
				return true;
			}
		}
		
		vm.disabledComplete = function (code) {
			if (code == 3) {
				return false;
			} else {
				return true;
			}
		}
		
		vm.disabledTerminate = function (code) {
			if (code !== 4 && code !== 5) {
				return false;
			} else {
				return true;
			}
		}
		
		
		
		return vm;
	}
	
})(angular);