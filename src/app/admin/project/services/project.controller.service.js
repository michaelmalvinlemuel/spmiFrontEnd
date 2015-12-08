(function(angular) {
	
	'use strict';
	
	angular.module('spmiFrontEnd')
		.factory('ProjectControllerService', ProjectControllerService)
		
	function ProjectControllerService($scope, $state, $modal, ProjectService, ProjectConverterService) {
		
		var controller = {}
		
		controller.update = function(vm) {
			
			vm.validated = false;

			vm.datePickerStatus = {}
			
			ProjectConverterService.decimalConverter(vm.input.projects);
			ProjectConverterService.dateConverter(vm.input);
			vm.status = ProjectConverterService.statusConverter(vm.input)
			
			vm.setting = {
				isAdmin: true,
				initiate: true,
				start: vm.input.start,
				ended: vm.input.ended,
				status: vm.input.status,
				type: vm.input.type,
			}
			
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
				for(var i = 0; i < vm.users.length; i++) {
					vm.data.push(vm.users[i].nik);
					vm.label.push(vm.users[i].name);
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
					vm.users = user
					vm.input.users = vm.users
				}, function(){});
			}
			
			
		
		
			vm.pickStart = function() {
				if (vm.input.start > vm.input.ended) {
					vm.minDateEnded = vm.input.start;
					(vm.limit) ? vm.input.ended = vm.input.start : vm.input.ended = undefined;
				}
			}
		
			$scope.$watch('vm.projects', function() {
				vm.input.projects = vm.projects;
				vm.nodes = vm.projects
			})
			
			vm.checkpoint = function() {
				
				//$scope.ProjectForm.name.$setDirty();
				$scope.ProjectForm.description.$setDirty();
				$scope.ProjectForm.start.$setDirty();
				$scope.ProjectForm.ended.$setDirty();
				$scope.ProjectForm.type.$setDirty();
				
				vm.input.projects = vm.projects 
				vm.input.users = vm.users;
				vm.input.assessors = vm.assessors;
				vm.input.status = '0';
				vm.msg = {};
				
				
				ProjectConverterService.decimalConverter(vm.input.projects);
				
				vm.msg = ProjectConverterService.validateCheckpoint(vm.input);
				
				if(vm.msg.general.length == 0 && $scope.ProjectForm.$valid) {
					
					ProjectService.update(vm.input).then(function() {
						$state.go('main.admin.project', null, {reload: true});
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
		
		return controller
			
	}
	
})(angular);