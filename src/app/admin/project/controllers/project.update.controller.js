(function(angular) {
	'use strict'
	
	angular.module('spmiFrontEnd')
		.controller('UpdateProjectController', UpdateProjectController)

	
	function UpdateProjectController ($scope, $state, $modal, $timeout, $window, projects, ProjectService, ProjectConverterService) {
		var vm = this;

		

		vm.input = projects;
		vm.nodes = vm.input.projects;
		
		vm.validated = false;

		vm.datePickerStatus = {}
		
		ProjectConverterService.decimalConverter(vm.input.projects);
		ProjectConverterService.dateConverter(vm.input);
		vm.status = ProjectConverterService.statusConverter(vm.input)
		
		vm.setting = {}
		
		vm.setting.initiate = true;
		vm.setting.start = vm.input.start;
		vm.setting.ended = vm.input.ended;
		vm.setting.status = vm.input.status;
		vm.setting.type = vm.input.type;
		
		vm.canModifyProject = true;
		vm.canAddMember = true;

		//check if prject status is initiation or preparation
		if (vm.input.status == '0') {
			vm.hasCheckpoint = true;

		} else {
			vm.setting.showGrade = true;
			vm.showAllocation = true;
			
			vm.data = [];
			vm.label = [];
			
			//for resource allocation
			for(var i = 0; i < vm.input.users.length; i++) {
				vm.data.push(vm.input.users[i].nik);
				vm.label.push(vm.input.users[i].name);
			}
			
		}
		
		//remove pivot attribute form database
		ProjectConverterService.userConverter(vm.input);
		
		vm.addProjectMember = function(){
			var modalInstance = $modal.open({
				animate: true,
				templateUrl: 'app/admin/user/views/modal.html',
				controller: 'ModalUserController as vm',
				size: 'lg',
				resolve: {
					users: function(){ return vm.input.users },
				}
			})
	
			modalInstance.result.then(function (user) {
				vm.input.users = user
			}, function(){});
		}
		
		
	
	
		vm.pickStart = function() {
			if (vm.input.start > vm.input.ended) {
				vm.minDateEnded = vm.input.start;
				(vm.limit) ? vm.input.ended = vm.input.start : vm.input.ended = undefined;
			}
		}
	
		$scope.$watch('vm.input.projects', function() {
			vm.nodes = vm.input.projects
		})
		
	
		
		
		
		vm.checkpoint = function() {
			
			//$scope.ProjectForm.name.$setDirty();
			$scope.ProjectForm.description.$setDirty();
			$scope.ProjectForm.start.$setDirty();
			$scope.ProjectForm.ended.$setDirty();
			$scope.ProjectForm.type.$setDirty();

			vm.input.status = '0';
			vm.msg = {};
			
			
			ProjectConverterService.decimalConverter(vm.input.projects);
			
			vm.msg = ProjectConverterService.validateCheckpoint(vm.input);
			
			if(vm.msg.general.length == 0 && $scope.ProjectForm.$valid) {
				
				ProjectService.update(vm.input).then(function() {
					$state.go($state.current.parent, null, {reload: true});
				});
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
		
		return vm;
	}
	
})(angular);