(function() {
	'use strict'
	
	angular.module('spmiFrontEnd')
		.controller('CreateProjectController', CreateProjectController)
	
	function CreateProjectController ($rootScope, $scope, $state, $modal, ProjectService, ProjectConverterService) {
		var vm = this;
		vm.validated = false;
		
		vm.setting = {
			isAdmin: true,
			initiate: true,
		}
		
		vm.canModifyProject = true;
		vm.canAddMember = true;
		vm.canChangeLeader = true;
		vm.hasSubmit = true;
		vm.hasCheckpoint = true;
		
		vm.input = {}
		vm.input.projects = []
		vm.input.users = []
		vm.input.assessors = []
		
		vm.status = {}
		vm.projects = []
		vm.projects = []
		vm.users = []
		vm.assessors = []
	
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
	
			modalInstance.result.then(function (users) {
				vm.users = users
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
			vm.msg = {}
			
			ProjectConverterService.decimalConverter(vm.input.projects);
			
			vm.msg = ProjectConverterService.validateCheckpoint(vm.input);
			
			if(vm.msg.general.length == 0 && $scope.ProjectForm.$valid) {
				
				vm.input.start = new Date(moment(vm.input.start).add(1, 'd'));
				vm.input.ended = new Date(moment(vm.input.ended).add(1, 'd'));
				
				ProjectService.store(vm.input).then(function() {
					$state.go('main.admin.project', null, {reload: true});
				}, function(){});
			}
			
		}
		
		vm.submit = function() {
			
			$scope.ProjectForm.name.$setDirty();
			$scope.ProjectForm.description.$setDirty();
			$scope.ProjectForm.start.$setDirty();
			$scope.ProjectForm.ended.$setDirty();
			$scope.ProjectForm.type.$setDirty();
			
			vm.input.projects = vm.projects;
			vm.input.users = vm.users;
			vm.input.assessors = vm.assessors;
			
			vm.input.status = '1';
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
				
				vm.input.start = new Date(moment(vm.input.start).add(1, 'd'));
				vm.input.ended = new Date(moment(vm.input.ended).add(1, 'd'));
			
				ProjectService.store(vm.input).then(function() {
					$state.go('main.admin.project', null, {reload: true});
				}, function(){});
			} else {
				alert('Terjadi kesalahan dalam input, silahkan lihat log error pada keterangan dibwah');
				vm.validated = true;
			}
			
		}
		
		vm.today = function() {
			vm.input.start = new Date();
		}
	
		vm.toggleMin = function() {
			vm.minDate = vm.minDate ? null : new Date();
		};
	
		vm.openStart = function($event) {
			vm.status.openedStart = true;
		};
	
		vm.openEnded = function($event) {
			vm.status.openedEnded = true;
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