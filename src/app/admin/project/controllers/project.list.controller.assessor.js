(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .controller('AssessorListProjectController', AssessorListProjectController)
        
    function AssessorListProjectController ($state, $timeout, projects, ProjectService
        , ProjectConverterService, ProjectPaginationService) {
            
        var vm = this;
        vm.projects = projects.data;
        vm.total = projects.total;
        
        vm.service = ProjectService.assessor;
        ProjectPaginationService.listCtrl(vm);
        
        vm.detail = function (id) {
			$state.go('main.user.projectAssess.detail', {projectId: id});
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
        
        return vm;
    } 
    
})(angular);