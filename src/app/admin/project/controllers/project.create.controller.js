(function(angular) {
	'use strict'
	
	angular.module('spmiFrontEnd')
		.controller('CreateProjectController', CreateProjectController)
	
	function CreateProjectController ($scope, $state, $modal, $window, template, ProjectService, ProjectTemplateService, ProjectConverterService) {
		var vm = this;
		vm.validated = false;
		
		vm.canModifyProject = true;
		vm.canAddMember = true;
		vm.hasCheckpoint = true;

		vm.showAllocation = false;
		vm.showStatus = false;
		vm.showLock = false;
		
		vm.input = {};
		vm.input.projects = [];
		vm.input.users = [];
		vm.input.assessors = [];
		
		vm.datePickerStatus = {};
		vm.projects = [];
		vm.nodes = [];
		vm.assessors = [];
		
		vm.input.name = template.name;
		vm.input.description = template.description;
		vm.input.projects = template.projects;
		ProjectConverterService.decimalConverter(vm.input.projects);
		vm.nodes = vm.input.projects;
		
		vm.addProjectMember = function() {
			var modalInstance = $modal.open({
				animate: true,
				templateUrl: 'app/admin/user/views/modal.html',
				controller: 'ModalUserController as vm',
				size: 'lg',
				resolve: {
					users: function(){ return vm.input.users },
				}
			})
	
			modalInstance.result.then(function (users) {
				vm.input.users = users
			}, function(){});
		}
	
		vm.pickStart = function() {
			if (vm.input.start > vm.input.ended) {
				vm.minDateEnded = vm.input.start;
				(vm.limit) ? vm.input.ended = vm.input.start : vm.input.ended = undefined;
			}
		}
	
		$scope.$watch('vm.input.projects', function() {
			vm.nodes = vm.projects;
			vm.input.projects = vm.input.projects;
		}, true)
		
		//console.log($state.current);
		
		vm.checkpoint = function() {
			
			$scope.ProjectForm.name.$setDirty();
			$scope.ProjectForm.description.$setDirty();
			$scope.ProjectForm.start.$setDirty();
			$scope.ProjectForm.ended.$setDirty();
			$scope.ProjectForm.type.$setDirty();
			
			
			vm.input.status = '0';
			vm.msg = {}
			
			ProjectConverterService.decimalConverter(vm.input.projects);
			
			vm.msg = ProjectConverterService.validateCheckpoint(vm.input);
			
			if(vm.msg.general.length == 0 && $scope.ProjectForm.$valid) {
				
				vm.input.start = new Date(moment(vm.input.start).add(1, 'd'));
				vm.input.ended = new Date(moment(vm.input.ended).add(1, 'd'));
				
				ProjectService.store(vm.input).then(function() {
					$state.go($state.current.parent, null, {reload: true});
				}, function(){});
			}
			
		}
		
		
		
		vm.today = function() {
			vm.input.start = new Date();
		}
	
		vm.toggleMin = function() {
			vm.minDate = vm.minDate ? null : new Date();
		};
	
		vm.openStart = function($event) {
			vm.datePickerStatus.openedStart = true;
		};
	
		vm.openEnded = function($event) {
			vm.datePickerStatus.openedEnded = true;
		};
	
		vm.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	
		vm.statusStart = {
			openedStart: false
		};
	
		vm.statusEnded = {
			openedEnded: false
		};
		
		
		//return vm;
		
	}
	
})(angular);