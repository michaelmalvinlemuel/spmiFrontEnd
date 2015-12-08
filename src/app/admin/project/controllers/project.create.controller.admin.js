(function(angular) {
	
	'use strict';
	
	angular.module('spmiFrontEnd')
		.controller('AdminCreateProjectController', AdminCreateProjectController)
	
	function AdminCreateProjectController($scope, $controller, $modal, $state, $window, template, ProjectService, ProjectTemplateService, ProjectConverterService) {

		var vm = this;
		angular.extend(vm, $controller('CreateProjectController', {$scope: $scope, template: template}))
		
		vm.canChangeLeader = true;
		vm.hasSubmit = true;
		vm.canAddAssessors = true;
		
		vm.setting = {
			isAdmin: true,
			initiate: true,
			showAssessorsNode: true,
			editableAssessorsNode: true,
			status: vm.input.status,
		}
		
		vm.addProjectAssessor = function () {
			var modalInstance = $modal.open({
				animate: true,
				templateUrl: 'app/admin/user/views/modal.html',
				controller: 'ModalUserController as vm',
				size: 'lg',
				resolve: {
					users: function() { 
						return vm.input.assessors 
					},
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
		
		vm.back = function() {
			$state.go('main.admin.project');
		}
		
		vm.submit = function() {
			
			$scope.ProjectForm.name.$setDirty();
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
				
				vm.input.start = new Date(moment(vm.input.start).add(1, 'd'));
				vm.input.ended = new Date(moment(vm.input.ended).add(1, 'd'));
			
				ProjectService.store(vm.input).then(function() {
					$state.go('main.admin.project', null, {reload: true});
				}, function(){});
			} else {
				alert('Terjadi kesalahan dalam input, silahkan lihat log error pada keterangan dibwah');
				vm.validated = true;
				var errorMsg = $window.open('/#/window/project/error');
				errorMsg.message = vm.msg;
			}
			
		}
		
		return vm;
	}
	
})(angular);