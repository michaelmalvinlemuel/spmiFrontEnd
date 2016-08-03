(function(angular) {
	
	'use strict';
	
	angular.module('spmiFrontEnd')
		.controller('AdminUpdateProjectController', AdminUpdateProjectController)
		
	
	function AdminUpdateProjectController($scope, $controller, $modal, $state, $window, projects, departments, ProjectService, ProjectConverterService) {

		var vm = this;
		
		vm.departments = departments;
		vm.input = projects;

		angular.extend(vm, $controller('UpdateProjectController', {$scope: $scope, projects: projects}));
		
		vm.canChangeLeader = true;
		vm.canAddAssessors = true;
		vm.hasSubmit = true;
		
		vm.setting.isAdmin = true;
		
		//used to showing user delegation report
		vm.isLeader = function() {
			return true;
		}

		vm.clearDepartment = function() {
			vm.input.department_id = undefined;
		}
		
		/**
		 * THIS FUNCTION BLOCK HAS SAME FUNCTIONALITIES WITH ADMIN UPDATE
		 * THIS NEED TO SEPERATE TO FACTORY SOMEHOW
		 * 
		 * BLOCK START
		 */
		
		vm.loadResource = function() {
			vm.data = [];
			vm.label = [];
			vm.dataLabel = ProjectConverterService.calculateResource(vm.input);
			//for resource allocation
			for (var i = 0; i < vm.input.users.length; i++) {
				
				var counter = 0;
				for (var j = 0; j < vm.dataLabel.length; j++ ) {
					
					if (vm.input.users[i].name == vm.dataLabel[j].label) {
						vm.data.push(vm.dataLabel[j].data);
						vm.label.push(vm.dataLabel[j].label);
						break;
					}
					counter++;
				}
			}
		}
		
		vm.loadResource();
		
		
		vm.reportUser = function(user) {
			var modalInstance = $modal.open({
				animate:true,
				templateUrl: 'app/admin/project/views/detail.modal.html',
				controller: 'ReportModalUserProjectController',
				size: 'lg',
				resolve: {
					projects: function() {
						return angular.copy(vm.input.projects);
					},
					user: function() {
						return user
					}
				}
			})
			
			modalInstance.result.then(function() {
				
			}, function() {
				
			})
		}
		
		/**
		 * BLOCK END
		 */
		
		
		
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
				vm.input.assessors = users;
			}, function(){});
		}
	
		vm.setLeader = function(object) {
			for (var i = 0 ; i < vm.input.users.length ; i++) {
				if (vm.input.users[i].id == object.id) {
					vm.input.users[i].leader = true;
				} else {
					vm.input.users[i].leader = false;
				}
			}
		}
		
		vm.submit = function() {
			
			//$scope.ProjectForm.name.$setDirty();
			$scope.ProjectForm.description.$setDirty();
			$scope.ProjectForm.start.$setDirty();
			$scope.ProjectForm.ended.$setDirty();
			$scope.ProjectForm.type.$setDirty();
			
			
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
				vm.msg.noAssessors.length == 0 &&
				$scope.ProjectForm.$valid
			) {
				ProjectService.update(vm.input).then(function(){
					$state.go('main.admin.project', null, {reload: true})
				}, function(){})
			} else {
				alert('Terjadi kesalahan dalam input, silahkan lihat log error pada keterangan dibwah');
				//var errorMsg = $window.open('/#/window');
				var errorMsg = $window.open('/#/window/project/error');
				errorMsg.message = vm.msg;
				
				vm.validated = true;
			}
				
			
		};
		
		vm.back = function() {
			$state.go('main.admin.project');
		}
		
		
		return vm;
		
	}
	
	
})(angular);