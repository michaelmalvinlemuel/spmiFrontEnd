(function() {
	'use strict'
	
	angular.module('spmiFrontEnd')
		.controller('UpdateProjectController', UpdateProjectController)
	
	function UpdateProjectController ($rootScope, $scope, $state, $modal, $timeout, projects, ProjectService, ProjectConverterService) {
		var vm = this;
		
		vm.validated = false;
		vm.input = projects
		vm.datePickerStatus = {}
		vm.projects = vm.input.projects
		vm.users = vm.input.users;	
		vm.assessors = vm.input.assessors;
		
		ProjectConverterService.decimalConverter(projects.projects);
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
		vm.canChangeLeader = true;
		vm.hasSubmit = true;
		
		
		//check if prject status is initiation or preparation
		if (vm.input.status == '0') {
			vm.hasCheckpoint = true;
			vm.setting.showGrade = false;
			vm.showAllocation = false;
			
		
		} else {
			vm.hasCheckpoint = false;
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
		
		vm.addProjectAssessor = function () {
			var modalInstance = $modal.open({
				animate: true,
				templateUrl: 'app/admin/user/views/modal.html',
				controller: 'ModalUserController as vm',
				size: 'lg',
				resolve: {
					users: function(){ return vm.input.assessors },
				}
			})
			
			modalInstance.result.then(function (users) {
				vm.assessors = users;
				vm.input.assessors = vm.assessors;
			}, function(){});
		}
	
		vm.setLeader = function(object) {
			for (var i = 0 ; i < vm.users.length ; i++) {
				if (vm.users[i].id == object.id) {
					vm.users[i].leader = true;
				} else {
					vm.users[i].leader = false;
				}
			}
			vm.input.users = vm.users;
		}
	
	
		vm.pickStart = function() {
			if (vm.input.start > vm.input.ended) {
				vm.minDateEnded = vm.input.start;
				(vm.limit) ? vm.input.ended = vm.input.start : vm.input.ended = undefined;
			}
		}
	
		$scope.$watch('vm.projects', function() {
			vm.input.projects = vm.projects;
		})
		
	
		
		vm.back = function() {
			$state.go('main.admin.project');
		}
		
		vm.checkpoint = function() {
			
			$scope.ProjectForm.name.$setDirty();
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
		
		vm.submit = function() {
			
			$scope.ProjectForm.name.$setDirty();
			$scope.ProjectForm.description.$setDirty();
			$scope.ProjectForm.start.$setDirty();
			$scope.ProjectForm.ended.$setDirty();
			$scope.ProjectForm.type.$setDirty();
			
			
			vm.input.status = '1';
			vm.input.projects = vm.projects 
			vm.input.users = vm.users 
			vm.input.assessors = vm.assessors;
			
			vm.msg = {}

			
			//convert weight into number
			ProjectConverterService.decimalConverter(vm.input.projects);
	
			//error checking before submit
			vm.msg = ProjectConverterService.validateSubmit(vm.input);
			
			//if all error had been handled
			if (
				vm.msg.general.length == 0 &&
				vm.msg.noChild.length == 0 &&
				vm.msg.noForm.length == 0 &&
				vm.msg.noWeight.length == 0 &&
				$scope.ProjectForm.$valid
			) {
				ProjectService.update(vm.input).then(function(){
					$state.go('main.admin.project', null, {reload: true})
				}, function(){})
			} else {
				alert('Terjadi kesalahan dalam input, silahkan lihat log error pada keterangan dibwah');
				vm.validated = true;
			}
				
			
		};
	
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
	
})();